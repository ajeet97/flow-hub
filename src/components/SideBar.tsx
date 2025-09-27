export default function SideBar({ children }) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Left Pane */}
            <aside
                style={{
                    width: "240px",
                    background: "#f9fafb",
                    borderRight: "1px solid #e5e7eb",
                    padding: "16px",
                }}
            >
                <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>Menu</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "12px" }}>
                        <button style={btnStyle}>Dashboard</button>
                    </li>
                    <li style={{ marginBottom: "12px" }}>
                        <button style={btnStyle}>Workflows</button>
                    </li>
                    <li>
                        <button style={btnStyle}>Settings</button>
                    </li>
                </ul>
            </aside>

            {children}
        </div>
    );
}

const btnStyle = {
    width: "100%",
    padding: "8px 12px",
    textAlign: "left",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
};
