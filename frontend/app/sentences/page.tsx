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
  const [isReady, setIsReady] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);

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
      } finally {
        setIsReady(true);
      }
    };

    loadSentences();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setSpeechAvailable("speechSynthesis" in window);
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
    (text: string) => {
      if (!speechAvailable || typeof window === "undefined" || !text) {
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Library
            </h2>
            <p className="text-sm text-slate-400">
              {sentences.length} sentence{sentences.length === 1 ? "" : "s"}
            </p>
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
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => speak(sentence.text)}
                        className="font-medium text-slate-300 transition hover:text-slate-100"
                      >
                        Play
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSentence(sentence.id)}
                        className="font-medium text-rose-400 transition hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={sentence.text}
                    onBlur={(event) =>
                      handleUpdateSentence(sentence.id, event.target.value)
                    }
                    className="h-24 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
