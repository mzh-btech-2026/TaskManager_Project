
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Home.module.css";

interface Task {
    id: number;
    name: string;
    description?: string;
    finished: boolean;
}

export default function Home() {

    const API_URL = "http://localhost:8080/api/v1/task";

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // FETCH ALL TASKS
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

    // LOAD TASKS WHEN PAGE OPENS
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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

            // Fetch latest tasks from database
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

            // Update frontend after database update succeeds
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

    // DELETE TASK (SOFT DELETE)
    const deleteTask = async (id: number) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to move this task to trash?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setDeletingId(id);

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            // Remove deleted task from the screen
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

    // CANCEL ADD TASK FORM
    const cancelForm = () => {

        setShowForm(false);
        setTitle("");
        setDescription("");

    };

    return (

        <div className={styles.container}>

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
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
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
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
                            {tasks.length} Tasks
                        </span>
                    </div>

                    {/* LOADING */}
                    {loading ? (

                        <p className={styles.message}>
                            Loading tasks...
                        </p>

                    ) : tasks.length === 0 ? (

                        /* EMPTY STATE */
                        <div className={styles.emptyState}>

                            <h3>No tasks found</h3>

                            <p>
                                Click Add Task to create your first task.
                            </p>

                        </div>

                    ) : (

                        /* TASK CARDS */
                        <div className={styles.taskGrid}>

                            {tasks.map((task) => (

                                <div
                                    className={styles.taskCard}
                                    key={task.id}
                                >

                                    <div className={styles.cardHeader}>

                                        <h3>{task.name}</h3>

                                        

                                    </div>

                                    <p className={styles.description}>
                                        {task.description ||
                                            "No description provided"}
                                    </p>

                                    {/* COMPLETION SLIDER */}
                                    <div className={styles.taskStatus}>

                                        <label className={styles.switch}>

                                            <input
                                                type="checkbox"
                                                checked={task.finished}
                                                disabled={
                                                    updatingId === task.id
                                                }
                                                onChange={() =>
                                                    handleComplete(
                                                        task.id,
                                                        task.finished
                                                    )
                                                }
                                            />

                                            <span
                                                className={styles.slider}
                                            ></span>

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
                                            onClick={() =>
                                                deleteTask(task.id)
                                            }
                                            disabled={
                                                deletingId === task.id
                                            }
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
