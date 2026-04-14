export default function FixLoading() {
  return (
    <div style={{
      background: "#fff",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "3px solid #f0f0f0",
        borderTopColor: "#00E013",
        animation: "spin 0.6s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
