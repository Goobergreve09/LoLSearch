import Header from "../components/Header";
import { useState } from "react";
import { Row, Col, Container, Button, Form, Table } from "react-bootstrap";
import { fetchAccountByRiotId, fetchPlayerMatches } from "../utils/LoLFetch";
import "../styles/aboutMe.css";

export default function AboutMe() {
  const [gameName, setGameName] = useState("");
  const [account, setAccount] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!gameName) return;

    setLoading(true);
    setError("");
    setAccount(null);
    setMatches([]);

    try {
      const data = await fetchAccountByRiotId(gameName);
      setAccount(data);

      const matchData = await fetchPlayerMatches(data.puuid, 5);
      setMatches(matchData);
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
          <Col md={8}>
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

            {error && <p className="text-danger mt-3 text-center">{error}</p>}

            {account && (
              <div className="mt-4 p-3 border rounded text-center">
                <h5>{account.gameName}#{account.tagLine}</h5>
                <p className="text-muted">PUUID:</p>
                <small>{account.puuid}</small>
              </div>
            )}

            {matches.length > 0 && (
              <div className="mt-4">
                <h5 className="text-center mb-3">Last {matches.length} Matches</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Champion</th>
                      <th>K</th>
                      <th>D</th>
                      <th>A</th>
                      <th>Win</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={m.matchId || i}>
                        <td>{m.champion}</td>
                        <td>{m.kills}</td>
                        <td>{m.deaths}</td>
                        <td>{m.assists}</td>
                        <td>{m.win ? "✔️" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
