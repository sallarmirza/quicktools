import { useEffect, useState, useContext, useRef } from "react";
import { ServiceContext } from "../context/ServiceContext";

export const Notepad = () => {
  // Access global context (speechText comes from mic)
  const { state } = useContext(ServiceContext);

  // Local states for note editing and management
  const [currentNotes, setCurrentNotes] = useState(""); // current editor content
  const [savedNotes, setSavedNotes] = useState([]);     // list of notes from backend
  const [tabTitle, setTabTitle] = useState("");         // extracted first line as note title
  const [isLoading, setIsLoading] = useState(false);    // loading state (saving/deleting/fetching)
  const [activeView, setActiveView] = useState("editor"); // can switch between "editor" and "saved"

  // Reference to the textarea (so we can auto-scroll when new speech is appended)
  const textareaRef = useRef(null);

  /**
   * 🟢 Speech-to-text integration:
   * Whenever speechText in context updates,
   * append it to the current note.
   */
  useEffect(() => {
    if (state.speechText) {
      setCurrentNotes((prev) => {
        const updated =
          prev + (prev.endsWith(" ") ? "" : " ") + state.speechText;

        // Update note title using the first line
        const firstLine = updated.split("\n")[0];
        setTabTitle(firstLine);

        return updated;
      });

      // Auto-scroll editor to bottom when new speech is added
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [state.speechText]);

  /**
   * 🟡 Fetch saved notes from backend when component mounts
   */
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/notes/");
      const data = await res.json();
      setSavedNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🟡 Save the current note to backend
   */
  const saveText = async () => {
    if (currentNotes.trim() !== "") {
      setIsLoading(true);

      // Create note object (title = first line or "Untitled")
      const newNote = {
        title: tabTitle.slice(0, 8) || "Untitled",
        content: currentNotes,
      };

      try {
        const res = await fetch("http://127.0.0.1:8000/notes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        });

        const data = await res.json();

        // Update UI with new saved note
        setSavedNotes([...savedNotes, data]);

        // Reset editor
        setCurrentNotes("");
        setTabTitle("");
      } catch (err) {
        console.error("Error saving note:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * 🟡 Clear current editor content
   */
  const clearNotes = () => {
    setCurrentNotes("");
    setTabTitle("");
  };

  /**
   * 🟡 Delete a note by ID
   */
  const deleteNote = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`http://127.0.0.1:8000/notes/${id}/`, { method: "DELETE" });
      setSavedNotes(savedNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format date for saved notes
   */
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveView("editor")}
          className={`py-3 px-6 font-medium text-sm ${
            activeView === "editor"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => {
            setActiveView("saved");
            fetchNotes(); // refresh saved notes
          }}
          className={`py-3 px-6 font-medium text-sm ${
            activeView === "saved"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Saved Notes {savedNotes.length > 0 && `(${savedNotes.length})`}
        </button>
      </div>

      {/* EDITOR VIEW */}
      {activeView === "editor" ? (
        <div className="space-y-6">
          {/* Textarea (typing + mic input) */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <textarea
              ref={textareaRef}
              value={currentNotes}
              onChange={(e) => {
                setCurrentNotes(e.target.value);

                // Extract first line as title
                const firstLine = e.target.value.split("\n")[0];
                setTabTitle(firstLine);
              }}
              placeholder="Save notes..."
              className="w-full p-4 focus:outline-none resize-none min-h-[300px] text-gray-700 leading-relaxed"
              disabled={isLoading}
            />
          </div>

          {/* Editor footer: word/char count + buttons */}
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentNotes.length} characters •{" "}
              {currentNotes.split(/\s+/).filter(Boolean).length} words
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearNotes}
                disabled={isLoading || !currentNotes}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
              >
                Clear
              </button>
              <button
                onClick={saveText}
                disabled={isLoading || !currentNotes.trim()}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // SAVED NOTES VIEW
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-4xl mb-3">📝</div>
              <p className="text-gray-500">No notes yet</p>
              <button
                onClick={() => setActiveView("editor")}
                className="mt-3 text-blue-500 hover:text-blue-600 text-sm"
              >
                Create your first note
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{note.title}</h3>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition duration-200"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="text-xs text-gray-400">
                    {note.created_at ? formatDate(note.created_at) : "No date"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
