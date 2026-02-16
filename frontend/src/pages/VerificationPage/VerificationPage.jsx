import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { VERIFY_EMAIL_URL } from "../../constants/urls"
import axsios from "axios"

function VerificationPage() {
  const match = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axsios.post(VERIFY_EMAIL_URL, { token: match.token }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(error => {
        setLoading(false);
        setError('An error occurred while verifying your email.');
      });
  });

  return (
    <Container className="mt-5">
      <h1>Verification Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {success && <p className="text-success">Email verified successfully!</p>}
    </Container>
  )
}

export default VerificationPage