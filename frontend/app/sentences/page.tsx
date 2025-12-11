"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Sentence,
  makeId,
} from "@/app/lib/sentence-utils";
import { sentencesService } from "@/lib/sentences-service";

type OperationStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function SentenceBankPage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [draft, setDraft] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadSentences = async () => {
      try {
        const loadedSentences = await sentencesService.getSentences();
        setSentences(loadedSentences);
      } catch (error) {
        console.error("Unable to load sentences", error);
        setSentences([]);
      }
    };

    loadSentences();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const checkSpeechAvailable = () => {
      setSpeechAvailable("speechSynthesis" in window);
    };

    checkSpeechAvailable();
  }, []);

  useEffect(() => {
    if (!operationStatus || typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      setOperationStatus(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [operationStatus]);

  const speak = useCallback(
    (text: string, audioUrl?: string) => {
      if (typeof window === "undefined" || !text) {
        return;
      }

      // 如果有 audioUrl，直接使用服务器生成的音频文件
      if (audioUrl) {
        try {
          // 停止任何正在播放的音频
          window.speechSynthesis.cancel();
          
          // 创建并播放音频
          const audio = new Audio(audioUrl);
          audio.play().catch(error => {
            console.error("Unable to play audio file", error);
            // 如果播放失败，回退到 SpeechSynthesis API
            fallbackToSpeechSynthesis(text);
          });
        } catch (error) {
          console.error("Error using audio file", error);
          // 如果出错，回退到 SpeechSynthesis API
          fallbackToSpeechSynthesis(text);
        }
      } else {
        // 没有 audioUrl，使用 SpeechSynthesis API
        fallbackToSpeechSynthesis(text);
      }

      // 回退到 SpeechSynthesis API 的函数
      function fallbackToSpeechSynthesis(text: string) {
        if (!speechAvailable) {
          return;
        }

        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("Unable to speak sentence", error);
        }
      }
    },
    [speechAvailable],
  );

  const handleAddSentence = async () => {
    const cleaned = draft.trim();
    if (!cleaned) {
      return;
    }

    const newSentence = { id: makeId(), text: cleaned };

    try {
      await sentencesService.addSentence(newSentence);
      setSentences((previous) => [...previous, newSentence]);
      setDraft("");
      setOperationStatus({
        type: "success",
        message: "Sentence added successfully.",
      });
    } catch (error) {
      console.error("Unable to add sentence", error);
      setOperationStatus({
        type: "error",
        message: "Failed to add sentence. Please try again.",
      });
    }
  };

  const handleUpdateSentence = async (id: string, text: string) => {
    try {
      await sentencesService.updateSentence(id, text);
      setSentences((previous) =>
        previous.map((sentence) =>
          sentence.id === id ? { ...sentence, text } : sentence,
        ),
      );
      setOperationStatus({
        type: "success",
        message: "Sentence updated successfully.",
      });
    } catch (error) {
      console.error("Unable to update sentence", error);
      setOperationStatus({
        type: "error",
        message: "Failed to update sentence. Please try again.",
      });
    }
  };

  const handleDeleteSentence = async (id: string) => {
    try {
      await sentencesService.deleteSentence(id);
      setSentences((previous) => previous.filter((sentence) => sentence.id !== id));
      setOperationStatus({
        type: "success",
        message: "Sentence deleted successfully.",
      });
    } catch (error) {
      console.error("Unable to delete sentence", error);
      setOperationStatus({
        type: "error",
        message: "Failed to delete sentence. Please try again.",
      });
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      await handleUpdateSentence(editingId, editText);
      setEditingId(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteAllSentences = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete all sentences? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      for (const sentence of sentences) {
        await sentencesService.deleteSentence(sentence.id);
      }

      setSentences([]);
      setOperationStatus({
        type: "success",
        message: "All sentences deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete all sentences:", error);
      setOperationStatus({
        type: "error",
        message: "Failed to delete all sentences. Please try again.",
      });
    }
  };

  const handleBulkAddSentences = async () => {
    if (!bulkInput.trim()) {
      setOperationStatus({
        type: "error",
        message: "Please enter a JSON array of sentences.",
      });
      return;
    }

    try {
      const parsed = JSON.parse(bulkInput);
      
      if (!Array.isArray(parsed)) {
        setOperationStatus({
          type: "error",
          message: "Please enter a valid JSON array.",
        });
        return;
      }

      if (parsed.length === 0) {
        setOperationStatus({
          type: "error",
          message: "Please enter at least one sentence.",
        });
        return;
      }

      // Validate all items are strings
      const invalidItems = parsed.filter(item => typeof item !== "string");
      if (invalidItems.length > 0) {
        setOperationStatus({
          type: "error",
          message: "Please ensure all items in the array are strings.",
        });
        return;
      }

      // Create sentence objects with unique ids
      const newSentences: Sentence[] = parsed.map(text => ({
        id: makeId(),
        text: text.trim(),
      })).filter(sentence => sentence.text.length > 0);

      if (newSentences.length === 0) {
        setOperationStatus({
          type: "error",
          message: "Please enter non-empty sentences.",
        });
        return;
      }

      try {
        await sentencesService.saveSentences(newSentences);
        setSentences(previous => [...previous, ...newSentences]);
        setBulkInput("");
        setOperationStatus({
          type: "success",
          message: `${newSentences.length} sentence${newSentences.length === 1 ? "" : "s"} added successfully.`,
        });
      } catch (error) {
        console.error("Unable to add bulk sentences", error);
        setOperationStatus({
          type: "error",
          message: "Failed to add sentences. Please try again.",
        });
      }
    } catch {
      setOperationStatus({
        type: "error",
        message: "Invalid JSON format. Please check your input.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Sentence Bank
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              Manage Your Practice Lists
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Add, edit, or delete the sentences you use on the practice screen.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-slate-100"
          >
            Back to Practice
          </Link>
        </header>

        {operationStatus && (
          <div
            className={`rounded-2xl border px-5 py-3 text-sm ${
              operationStatus.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-rose-500/40 bg-rose-500/10 text-rose-200"
            }`}
          >
            {operationStatus.message}
          </div>
        )}

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Add a sentence
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Draft a new practice sentence. It will appear at the end of the list.
          </p>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Example: She left the keys on the kitchen counter."
            className="mt-4 min-h-[96px] w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddSentence}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-emerald-400"
            >
              Save sentence
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Bulk Add Sentences
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Add multiple sentences at once using a JSON array. Example: [First sentence, Second sentence]
          </p>
          <textarea
            value={bulkInput}
            onChange={(event) => setBulkInput(event.target.value)}
            placeholder='Example: ["Hello world", "How are you?"]'
            className="mt-4 min-h-[120px] w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleBulkAddSentences}
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-blue-400"
            >
              Bulk Add
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Library
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-400">
                {sentences.length} sentence{sentences.length === 1 ? "" : "s"}
              </p>
              {sentences.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteAllSentences}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                >
                  Delete All
                </button>
              )}
            </div>
          </div>
          {sentences.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nothing here yet. Add a sentence above to get started.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {sentences.map((sentence, index) => (
                <div
                  key={sentence.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-sm shadow-slate-950/30"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Sentence {index + 1}
                    </span>
                    {editingId === sentence.id ? (
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="font-medium text-emerald-400 transition hover:text-emerald-300"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="font-medium text-slate-300 transition hover:text-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => speak(sentence.text, sentence.audioUrl)}
                          className="font-medium text-slate-300 transition hover:text-slate-100"
                        >
                          Play
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(sentence.id, sentence.text)}
                          className="font-medium text-emerald-400 transition hover:text-emerald-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSentence(sentence.id)}
                          className="font-medium text-rose-400 transition hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId === sentence.id ? (
                    <textarea
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      className="h-24 w-full resize-none rounded-xl border border-emerald-500/40 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      autoFocus
                    />
                  ) : (
                    <div className="h-24 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-200">
                      {sentence.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
