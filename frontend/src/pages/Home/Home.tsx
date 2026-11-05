
import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Home.module.css";

interface Task {
    id: number;
    name: string;
    description?: string;
    finished: boolean;
    created_at: string;
}

export default function Home() {

    const API_URL = "http://localhost:8080/api/v1/task";

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    


    // FETCH ALL ACTIVE TASKS
    const fetchTasks = useCallback(async () => {

        try {

            const response = await fetch(`${API_URL}/get`);

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data: Task[] = await response.json();

            setTasks(data);

        } catch (error) {

            console.error("Error fetching tasks:", error);
            alert("Unable to load tasks");

        } finally {

            setLoading(false);

        }

    }, []);

    // LOAD TASKS
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // SEARCH AND FILTER
    const filteredTasks = useMemo(() => {

        return tasks.filter((task) => {

            const matchesSearch =
                task.name.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "completed"
                        ? task.finished
                        : !task.finished;

            return matchesSearch && matchesFilter;

        });

    }, [tasks, search, filter]);

    // ADD NEW TASK
    const saveTask = async () => {

        if (!title.trim()) {
            alert("Please enter task title");
            return;
        }

        try {

            setSaving(true);

            const response = await fetch(`${API_URL}/`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: title.trim(),
                    description: description.trim()
                })

            });

            if (!response.ok) {
                throw new Error("Failed to save task");
            }

            await fetchTasks();

            setTitle("");
            setDescription("");
            setShowForm(false);

        } catch (error) {

            console.error("Error saving task:", error);
            alert("Unable to save task");

        } finally {

            setSaving(false);

        }

    };


    // FORMAT CREATED DATE
const formatDate = (date: string) => {

    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "Date not available";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};


    // COMPLETE / UNCOMPLETE TASK
    const handleComplete = async (
        id: number,
        currentStatus: boolean
    ) => {

        const newStatus = !currentStatus;

        try {

            setUpdatingId(id);

            const response = await fetch(
                `${API_URL}/${id}/completion?finished=${newStatus}`,
                {
                    method: "PATCH"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id
                        ? { ...task, finished: newStatus }
                        : task
                )
            );

        } catch (error) {

            console.error("Error updating task:", error);
            alert("Unable to update task status");

        } finally {

            setUpdatingId(null);

        }

    };

    // DELETE TASK
    const deleteTask = async (id: number) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to move this task to trash?"
        );

        if (!confirmDelete) return;

        try {

            setDeletingId(id);

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== id)
            );

        } catch (error) {

            console.error("Error deleting task:", error);
            alert("Unable to delete task");

        } finally {

            setDeletingId(null);

        }

    };

    // CANCEL FORM
    const cancelForm = () => {

        setShowForm(false);
        setTitle("");
        setDescription("");

    };

    return (

        <div className={styles.container}>

            <Sidebar />

            <main className={styles.maincont}>

                {/* HEADER */}
                <div className={styles.header}>

                    <div className={styles.heading}>

                        <h1>My Tasks</h1>

                        <p>
                            Organize your tasks, getting things done!
                        </p>

                    </div>

                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                    >
                        + Add Task
                    </button>

                </div>

                {/* ADD TASK FORM */}
                {showForm && (

                    <div className={styles.formBox}>

                        <h3>Add New Task</h3>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className={styles.formActions}>

                            <button
                                onClick={cancelForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveTask}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Task"}
                            </button>

                        </div>

                    </div>

                )}

                {/* TASK SECTION */}
                <section className={styles.taskSection}>

                    <div className={styles.sectionHeader}>

                        <h2>All Tasks</h2>

                        <span className={styles.taskCount}>
                            {filteredTasks.length} / {tasks.length} Tasks
                        </span>

                    </div>

                    {/* SEARCH AND FILTER */}
                    <div className={styles.toolbar}>

                        <div className={styles.searchBox}>

                            <span className={styles.searchIcon}>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search tasks by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {search && (

                                <button
                                    className={styles.clearSearch}
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>

                            )}

                        </div>

                        <div className={styles.sortBox}>

                            <label htmlFor="taskFilter">
                                Filter:
                            </label>

                            <select
                                id="taskFilter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >

                                <option value="all">All Tasks</option>

                                <option value="completed">
                                    Completed Tasks
                                </option>

                                <option value="pending">
                                    Pending Tasks
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* LOADING */}
                    {loading ? (

                        <p className={styles.message}>
                            Loading tasks...
                        </p>

                    ) : filteredTasks.length === 0 ? (

                        <div className={styles.emptyState}>

                            <h3>
                                {search || filter !== "all"
                                    ? "No matching tasks found"
                                    : "No tasks found"}
                            </h3>

                            <p>
                                {search || filter !== "all"
                                    ? "Try changing your search or filter."
                                    : "Click Add Task to create your first task."}
                            </p>

                            {(search || filter !== "all") && (

                                <button
                                    className={styles.resetButton}
                                    onClick={() => {
                                        setSearch("");
                                        setFilter("all");
                                    }}
                                >
                                    Reset Filters
                                </button>

                            )}

                        </div>

                    ) : (

                        /* TASK CARDS */
                        <div className={styles.taskGrid}>

                            {filteredTasks.map((task) => (

                                <div
                                    className={styles.taskCard}
                                    key={task.id}
                                >

                                    {/* CARD HEADER */}
                                    <div className={styles.cardHeader}>

                                        <h3>{task.name}</h3>

                                        <span className={styles.taskId}>
                                            #{task.id}
                                        </span>

                                    </div>

                                    {/* DESCRIPTION */}
                                    <p className={styles.description}>
                                        {task.description ||
                                            "No description provided"}
                                    </p>

                                   {/* CREATED DATE */}
<div className={styles.createdDate}>

    <span>📅</span>

    <div>
        <span className={styles.dateLabel}>
            Created At
        </span>

        <span className={styles.dateValue}>
            {formatDate(task.created_at)}
        </span>
    </div>

</div>

                                    {/* COMPLETION SWITCH */}
                                    <div className={styles.taskStatus}>

                                        <label className={styles.switch}>

                                            <input
                                                type="checkbox"
                                                checked={task.finished}
                                                disabled={updatingId === task.id}
                                                onChange={() =>
                                                    handleComplete(
                                                        task.id,
                                                        task.finished
                                                    )
                                                }
                                            />

                                            <span className={styles.slider}></span>

                                        </label>

                                        <span
                                            className={
                                                task.finished
                                                    ? styles.completed
                                                    : styles.pending
                                            }
                                        >

                                            {updatingId === task.id
                                                ? "Updating..."
                                                : task.finished
                                                    ? "Completed"
                                                    : "Pending"}

                                        </span>

                                    </div>

                                    {/* DELETE BUTTON */}
                                    <div className={styles.cardActions}>

                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => deleteTask(task.id)}
                                            disabled={deletingId === task.id}
                                        >

                                            {deletingId === task.id
                                                ? "Deleting..."
                                                : "Delete"}

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}
