import "../assets/bd-coming-soon.css";

export const Links = (): JSX.Element => {
  return (
    <main className="my-auto">
      <div className="container">
        <nav className="footer-social-links">
          <a href="https://www.instagram.com/worldpolyio/" target="_blank" className="social-link">
            <i className="mdi mdi-instagram"></i>
          </a>
          <a href="https://twitter.com/worldpolyio" className="social-link" target="_blank">
            <i className="mdi mdi-twitter"></i>
          </a>
          <a href="https://t.me/worldpolytr" className="social-link" target="_blank">
            <i className="mdi mdi-telegram"></i>
          </a>
          <a href="https://www.linkedin.com/company/worldpolyy/" className="social-link" target="_blank">
            <i className="mdi mdi-linkedin"></i>
          </a>
          <a href="https://medium.com/@worldpoly08" className="social-link" target="_blank">
            <i className="mdi mdi-medium"></i>
          </a>
        </nav>
      </div>
    </main>
  );
};
