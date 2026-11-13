import FeedbackForm from './FeedbackForm.jsx';
import SubmissionHistory from './SubmissionHistory.jsx';

export default function FeedbackSection({ submissions, onSubmitted }) {
  return (
    <section id="feedback" className="section section--alt" aria-labelledby="feedback-title">
      <div className="container">
        <h2 id="feedback-title">Share your feedback</h2>
        <p className="section-intro">
          Complete the form below. We validate your answers before sending and show a reference number once your
          feedback is saved.
        </p>
        <div className="feedback-layout">
          <div className="card">
            <FeedbackForm onSubmitted={onSubmitted} />
          </div>
          <SubmissionHistory items={submissions} />
        </div>
      </div>
    </section>
  );
}
