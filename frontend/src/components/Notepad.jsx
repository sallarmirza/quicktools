import { useEffect, useState } from "react";

export const Notepad = () => {
  const [currentNotes, setCurrentNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [tabTitle, setTabTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState("editor"); // "editor" or "saved"

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

  const saveText = async () => {
    if (currentNotes.trim() !== "") {
      setIsLoading(true);
      const newNote = { title: tabTitle.slice(0, 25) || "Untitled", content: currentNotes };
      try {
        const res = await fetch("http://127.0.0.1:8000/notes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        });
        const data = await res.json();
        setSavedNotes([...savedNotes, data]);
        setCurrentNotes("");
        setTabTitle("");
      } catch (err) {
        console.error("Error saving note:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearNotes = () => {
    setCurrentNotes("");
    setTabTitle("");
  };

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

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveView("editor")}
          className={`py-3 px-6 font-medium text-sm ${activeView === "editor" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Editor
        </button>
        <button
          onClick={() => {
            setActiveView("saved");
            fetchNotes();
          }}
          className={`py-3 px-6 font-medium text-sm ${activeView === "saved" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Saved Notes {savedNotes.length > 0 && `(${savedNotes.length})`}
        </button>
      </div>

      {activeView === "editor" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <textarea
              value={currentNotes}
              onChange={(e) => {
                setCurrentNotes(e.target.value);
                // Extract first line as title
                const firstLine = e.target.value.split('\n')[0];
                setTabTitle(firstLine);
              }}
              placeholder="Start writing here..."
              className="w-full p-4 focus:outline-none resize-none min-h-[300px] text-gray-700 leading-relaxed"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentNotes.length} characters • {currentNotes.split(/\s+/).filter(Boolean).length} words
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
                <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
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
                  <p className="text-gray-600 text-sm mb-3 whitespace-pre-wrap">{note.content}</p>
                  <div className="text-xs text-gray-400">
                    {note.created_at ? formatDate(note.created_at) : 'No date'}
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