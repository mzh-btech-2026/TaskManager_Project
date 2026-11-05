
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Trash.module.css";

interface Task {
    id: number;
    name: string;
    description?: string;
    finished: boolean;
}

export default function Trash() {

    const API_URL = "http://localhost:8080/api/v1/task";

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [restoringAll, setRestoringAll] = useState(false);
    const [deletingAll, setDeletingAll] = useState(false);

    // FETCH TRASH TASKS
    const fetchTasks = useCallback(async () => {

        try {

            const response = await fetch(`${API_URL}/trash`);

            if (!response.ok) {
                throw new Error("Failed to fetch trash tasks");
            }

            const data: Task[] = await response.json();

            setTasks(data);

        } catch (error) {

            console.error("Error fetching trash:", error);
            alert("Unable to load trash tasks");

        } finally {

            setLoading(false);

        }

    }, []);

    // LOAD TASKS WHEN PAGE OPENS
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);


    // RESTORE SINGLE TASK
    const restoreTask = async (id: number) => {

        try {

            setRestoringId(id);

            const response = await fetch(
                `${API_URL}/${id}/restore`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to restore task");
            }

            // Remove restored task from Trash screen
            setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== id)
            );

        } catch (error) {

            console.error("Error restoring task:", error);
            alert("Unable to restore task");

        } finally {

            setRestoringId(null);

        }

    };


    // RESTORE ALL TASKS
    const restoreAll = async () => {

        if (tasks.length === 0) return;

        const confirmed = window.confirm(
            "Are you sure you want to restore all tasks?"
        );

        if (!confirmed) return;

        try {

            setRestoringAll(true);

            const response = await fetch(
                `${API_URL}/trash/restore-all`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to restore all tasks");
            }

            setTasks([]);

            alert("All tasks restored successfully");

        } catch (error) {

            console.error("Error restoring all:", error);
            alert("Unable to restore all tasks");

        } finally {

            setRestoringAll(false);

        }

    };


    // PERMANENT DELETE SINGLE TASK
    const deleteTask = async (id: number) => {

        const confirmed = window.confirm(
            "Are you sure? This task will be permanently deleted!"
        );

        if (!confirmed) return;

        try {

            setDeletingId(id);

            const response = await fetch(
                `${API_URL}/${id}/permanent`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to permanently delete task");
            }

            // Remove deleted task from screen
            setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== id)
            );

        } catch (error) {

            console.error("Error deleting task:", error);
            alert("Unable to permanently delete task");

        } finally {

            setDeletingId(null);

        }

    };


    // PERMANENT DELETE ALL TASKS
    const deleteAll = async () => {

        if (tasks.length === 0) return;

        const confirmed = window.confirm(
            "WARNING! All trashed tasks will be permanently deleted. Continue?"
        );

        if (!confirmed) return;

        try {

            setDeletingAll(true);

            const response = await fetch(
                `${API_URL}/trash/empty`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete all tasks");
            }

            setTasks([]);

            alert("All trashed tasks permanently deleted");

        } catch (error) {

            console.error("Error deleting all:", error);
            alert("Unable to delete all tasks");

        } finally {

            setDeletingAll(false);

        }

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

                        <h1>Trash</h1>

                        <p>
                            Restore your tasks or permanently delete them.
                        </p>

                    </div>

                    {/* HEADER BUTTONS */}
                    <div className={styles.headerActions}>

                        <button
                            className={styles.restoreAllButton}
                            onClick={restoreAll}
                            disabled={
                                restoringAll ||
                                deletingAll ||
                                tasks.length === 0
                            }
                        >
                            {restoringAll
                                ? "Restoring..."
                                : "↩ Restore All"}
                        </button>

                        

                        <button
                            className={styles.deleteAllButton}
                            onClick={deleteAll}
                            disabled={
                                deletingAll ||
                                restoringAll ||
                                tasks.length === 0
                            }
                        >
                            {deletingAll
                                ? "Deleting..."
                                : "🗑 Delete All"}
                        </button>

                    </div>

                </div>


                {/* TASK SECTION */}
                <section className={styles.taskSection}>

                    <div className={styles.sectionHeader}>

                        <h2>Trashed Tasks</h2>

                        <span className={styles.taskCount}>
                            {tasks.length} Tasks
                        </span>

                    </div>


                    {/* LOADING */}
                    {loading ? (

                        <p className={styles.message}>
                            Loading trash tasks...
                        </p>

                    ) : tasks.length === 0 ? (

                        /* EMPTY STATE */
                        <div className={styles.emptyState}>

                            <div className={styles.emptyIcon}>
                                🗑️
                            </div>

                            <h3>Trash is empty</h3>

                            <p>
                                Deleted tasks will appear here.
                            </p>

                        </div>

                    ) : (

                        /* TASK GRID */
                        <div className={styles.taskGrid}>

                            {tasks.map(task => (

                                <div
                                    className={styles.taskCard}
                                    key={task.id}
                                >

                                    {/* CARD HEADER */}
                                    <div className={styles.cardHeader}>

                                        <h3>{task.name}</h3>

                                        <span className={styles.deletedBadge}>
                                            Trashed
                                        </span>

                                    </div>


                                    {/* DESCRIPTION */}
                                    <p className={styles.description}>
                                        {task.description ||
                                            "No description provided"}
                                    </p>


                                    {/* TASK STATUS */}
                                    <span
                                        className={
                                            task.finished
                                                ? styles.completed
                                                : styles.pending
                                        }
                                    >
                                        {task.finished
                                            ? "Completed"
                                            : "Pending"}
                                    </span>


                                    {/* ACTION BUTTONS */}
                                    <div className={styles.cardActions}>

                                        {/* RESTORE BUTTON */}
                                        <button
                                            className={styles.restoreButton}
                                            onClick={() =>
                                                restoreTask(task.id)
                                            }
                                            disabled={
                                                restoringId === task.id ||
                                                deletingId === task.id ||
                                                restoringAll ||
                                                deletingAll
                                            }
                                        >
                                            {restoringId === task.id
                                                ? "Restoring..."
                                                : "↩ Restore"}
                                        </button>


                                        {/* DELETE BUTTON */}
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                deleteTask(task.id)
                                            }
                                            disabled={
                                                deletingId === task.id ||
                                                restoringId === task.id ||
                                                restoringAll ||
                                                deletingAll
                                            }
                                        >
                                            {deletingId === task.id
                                                ? "Deleting..."
                                                : "🗑 Delete"}
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
