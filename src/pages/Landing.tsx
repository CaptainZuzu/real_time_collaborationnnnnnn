import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Landing = () => {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 mb-4">Welcome to CollabDocs</h1>
          <p className="lead mb-4">
            A powerful platform for real-time document collaboration and management.
            Create, edit, and share documents with your team in real-time.
          </p>
          <div className="d-flex gap-3">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-primary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Collaboration"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      <div className="row mt-5 pt-5">
        <h2 className="text-center mb-5">Key Features</h2>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h5">Real-Time Collaboration</h3>
              <p className="card-text">
                Work together with your team in real-time, seeing changes as they happen.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h5">Secure Access</h3>
              <p className="card-text">
                Advanced security features to keep your documents safe and private.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title h5">Easy Document Management</h3>
              <p className="card-text">
                Organize and manage your documents efficiently with intuitive tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 