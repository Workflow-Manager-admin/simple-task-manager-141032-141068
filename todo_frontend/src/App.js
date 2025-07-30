import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Color palette from request
const COLORS = {
  accent: "#ff9800",
  primary: "#1976d2",
  secondary: "#424242",
};

function getInitialTheme() {
  return "dark";
}

// PUBLIC_INTERFACE
function App() {
  // Core state for todos and theme
  const [todos, setTodos] = useState(() =>
    JSON.parse(localStorage.getItem("todos") || "[]")
  );
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Persist todos locally
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Focus for edit
  useEffect(() => {
    if (editId !== null && inputRef.current) inputRef.current.focus();
  }, [editId]);

  // PUBLIC_INTERFACE
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input.trim(),
        completed: false,
      },
    ]);
    setInput("");
  };

  // PUBLIC_INTERFACE
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (editId === id) {
      setEditId(null);
      setEditValue("");
    }
  };

  // PUBLIC_INTERFACE
  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  // PUBLIC_INTERFACE
  const handleEditStart = (id, text) => {
    setEditId(id);
    setEditValue(text);
  };

  // PUBLIC_INTERFACE
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // PUBLIC_INTERFACE
  const handleEditSave = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: trimmed,
            }
          : todo
      )
    );
    setEditId(null);
    setEditValue("");
  };

  // PUBLIC_INTERFACE
  const handleEditCancel = () => {
    setEditId(null);
    setEditValue("");
  };

  // PUBLIC_INTERFACE
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleAddTodo(e);
  };

  // PUBLIC_INTERFACE
  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") handleEditSave(id);
    else if (e.key === "Escape") handleEditCancel();
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // UI COMPONENTS

  function Header() {
    return (
      <header className="todo-header" style={{ background: COLORS.secondary }}>
        <h1 className="todo-title" style={{ color: COLORS.accent }}>
          📝 Todo Manager
        </h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
    );
  }

  function TodoInput() {
    return (
      <form className="todo-input-bar" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Add a new todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          aria-label="New todo"
          style={{ color: "var(--text-primary)" }}
          autoFocus
        />
        <button
          type="submit"
          style={{
            background: COLORS.accent,
            color: "#fff",
          }}
          className="add-btn"
        >
          Add
        </button>
      </form>
    );
  }

  function TodoList() {
    if (!todos.length)
      return (
        <div className="todo-empty">
          <span role="img" aria-label="empty">
            🎉
          </span>{" "}
          All done! No todos.
        </div>
      );
    return (
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item${todo.completed ? " completed" : ""}`}
            style={{
              borderColor:
                editId === todo.id ? COLORS.primary : "var(--border-color)",
            }}
          >
            <button
              className="checkbox"
              aria-label={
                todo.completed ? "Mark as incomplete" : "Mark as completed"
              }
              onClick={() => handleToggleComplete(todo.id)}
              tabIndex={0}
              style={{
                borderColor: COLORS.accent,
                color: todo.completed ? COLORS.accent : COLORS.primary,
              }}
            >
              {todo.completed ? "✓" : ""}
            </button>
            {editId === todo.id ? (
              <input
                type="text"
                ref={inputRef}
                value={editValue}
                onChange={handleEditChange}
                onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                className="todo-edit-input"
                aria-label="Edit todo"
              />
            ) : (
              <span
                className="todo-text"
                onDoubleClick={() => handleEditStart(todo.id, todo.text)}
                tabIndex={0}
                style={{
                  color: todo.completed
                    ? "var(--text-secondary)"
                    : "var(--text-primary)",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                aria-label={"Todo: " + todo.text}
              >
                {todo.text}
              </span>
            )}
            <div className="todo-actions">
              {editId === todo.id ? (
                <>
                  <button
                    onClick={() => handleEditSave(todo.id)}
                    className="action-btn save-btn"
                    style={{ background: COLORS.primary }}
                    aria-label="Save"
                  >
                    💾
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="action-btn"
                    aria-label="Cancel"
                  >
                    ✖
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditStart(todo.id, todo.text)}
                    className="action-btn"
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="action-btn"
                    aria-label="Delete"
                    style={{ color: COLORS.accent }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="todo-app-wrapper">
      <Header />
      <main className="main-section">
        <TodoInput />
        <TodoList />
      </main>
      <footer className="todo-footer">
        <span>
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </span>
        <span>
          Completed: {todos.filter((t) => t.completed).length} / {todos.length}
        </span>
      </footer>
    </div>
  );
}

export default App;
