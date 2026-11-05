
import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/TM_LOGO.png";
import styles from "./Sidebar.module.css";

export default function Sidebar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleClearAll = async () => {

        const confirmClear = window.confirm(
            "Are you sure you want to move all tasks to trash?"
        );

        if (!confirmClear) return;

        try {

            const response = await fetch(
                "http://localhost:8080/api/v1/task/all",
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to clear tasks");
            }

            alert("All tasks moved to trash successfully!");

            // Refresh the page to show updated tasks
            window.location.reload();

        } catch (error) {

            console.error("Error clearing tasks:", error);
            alert("Unable to clear tasks");

        }
    };

    return (

        <>
            {/* MOBILE HEADER */}
            <div className={styles.mobileHeader}>

                <div className={styles.mobileLogo}>
                    <img src={logo} alt="Task Manager Logo" />
                    <span>Task Manager</span>
                </div>

                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

            </div>

            {/* SIDEBAR */}
            <aside
                className={`${styles.sidebar} ${
                    menuOpen ? styles.sidebarOpen : ""
                }`}
            >

                {/* LOGO SECTION */}
                <div className={styles.logoSection}>

                    <img
                        src={logo}
                        alt="Task Manager Logo"
                        className={styles.logo}
                    />

                    <p className={styles.title}>
                        Task Manager
                    </p>

                </div>

                {/* NAVIGATION */}
                <nav className={styles.navigation}>

                    <NavLink
                        to="/"
                        end
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `${styles.button} ${
                                isActive ? styles.active : ""
                            }`
                        }
                    >
                        <span className={styles.navIcon}>🏠</span>
                        <span>All Tasks</span>
                    </NavLink>

                    <NavLink
                        to="/trash"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            `${styles.button} ${
                                isActive ? styles.active : ""
                            }`
                        }
                    >
                        <span className={styles.navIcon}>🗑️</span>
                        <span>Trash</span>
                    </NavLink>

                </nav>

                {/* BOTTOM SECTION */}
                <div className={styles.bottomSection}>

                    <button
                        className={styles.clearButton}
                        onClick={handleClearAll}
                    >
                        <span>🧹</span>
                        <span>Clear All Tasks</span>
                    </button>

                </div>

            </aside>

            {/* MOBILE OVERLAY */}
            {menuOpen && (
                <div
                    className={styles.overlay}
                    onClick={closeMenu}
                />
            )}

        </>

    );
}
