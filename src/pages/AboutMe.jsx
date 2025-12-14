import Header from "../components/Header";
import { useState } from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import { fetchAccountByRiotId } from "../utils/LoLFetch";
import "../styles/aboutMe.css";

export default function AboutMe() {
  const [gameName, setGameName] = useState("");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!gameName) return;

    setLoading(true);
    setError("");
    setAccount(null);

    try {
      const data = await fetchAccountByRiotId(gameName);
      setAccount(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Enter Riot ID (Game Name)"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />

            <Button
              className="mt-3 w-100"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>

            {error && (
              <p className="text-danger mt-3 text-center">{error}</p>
            )}

            {account && (
              <div className="mt-4 p-3 border rounded text-center">
                <h5>{account.gameName}#{account.tagLine}</h5>
                <p className="text-muted">PUUID:</p>
                <small>{account.puuid}</small>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

