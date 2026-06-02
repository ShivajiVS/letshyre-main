import "@/pages/employee/auth/styles/auth-login.css";

export function AuthLayout({ image, title, children }) {
  return (
    <div className="candidate-page-main">
      <div className="candidate-page">
        {/* IMAGE SECTION */}
        <div className="candidate-img-part">
          <img className="candidate-mainImg" src={image} alt={title || "Auth Graphic"} />
        </div>

        {/* FORM SECTION */}
        <div className="form-part">
          {title && <h1 className="cl-title">{title}</h1>}
          {children}
        </div>

        {/* BACKGROUND BALLS */}
        <div className="cl-ball01"></div>
        <div className="cl-ball02"></div>
      </div>
    </div>
  );
}
