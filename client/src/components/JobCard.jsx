// src/components/JobCard.jsx
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title>{job.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{job.location || 'Remote'}</Card.Subtitle>
            <Card.Text className="text-truncate" style={{maxWidth: 600}}>
              {job.description}
            </Card.Text>
          </div>
          <div className="text-end">
            <div className="mb-2"><small className="text-muted">{job.employment_type}</small></div>
            <Link to={`/jobs/${job.id}`}>
              <Button variant="primary">View</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
