export default function SkeletonProductCard() {
  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100"
        style={{
          borderRadius: "var(--catalog-surface-radius, 22px)",
          overflow: "hidden",
        }}
      >
        <div
          className="placeholder w-100"
          style={{ height: "200px" }}
        ></div>

        <div className="card-body d-flex flex-column">
          <h5 className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </h5>

          <p className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </p>

          <div className="mt-auto">
            <span className="btn btn-success disabled placeholder col-6"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
