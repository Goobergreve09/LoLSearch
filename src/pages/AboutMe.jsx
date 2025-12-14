import Header from "../components/Header";
import { useState } from "react";
import { Row, Col, Container, Button, Form, Table } from "react-bootstrap";
import { fetchAccountByRiotId, fetchPlayerMatches } from "../utils/LoLFetch";
import "../styles/aboutMe.css";

export default function AboutMe() {
  const [gameName, setGameName] = useState("");
  const [account, setAccount] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!gameName) return;

    setLoading(true);
    setError("");
    setAccount(null);
    setMatches([]);
    setStats(null);

    try {
      // Fetch account info
      const data = await fetchAccountByRiotId(gameName);
      setAccount(data);

      // Fetch last 10 matches
      const matchData = await fetchPlayerMatches(data.puuid, 10);
      setMatches(matchData);

      // Compute stats
      if (matchData.length > 0) {
        const championCount = {};
        const positionCount = {};
        let totalKills = 0;
        let totalDeaths = 0;
        let totalAssists = 0;

        matchData.forEach((m) => {
          // Count champions
          championCount[m.champion] = (championCount[m.champion] || 0) + 1;
          // Count positions
          positionCount[m.position] = (positionCount[m.position] || 0) + 1;
          // Sum KDA
          totalKills += m.kills;
          totalDeaths += m.deaths;
          totalAssists += m.assists;
        });

        // Most used champion
        const mostPlayedChampion = Object.entries(championCount).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["", 0]
        )[0];

        // Most used position
        const mostPlayedPosition = Object.entries(positionCount).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["", 0]
        )[0];

        // Average KDA
        const avgKills = (totalKills / matchData.length).toFixed(1);
        const avgDeaths = (totalDeaths / matchData.length).toFixed(1);
        const avgAssists = (totalAssists / matchData.length).toFixed(1);

        setStats({
          mostPlayedChampion,
          mostPlayedPosition,
          avgKDA: `${avgKills} / ${avgDeaths} / ${avgAssists}`,
        });
      }
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
                <h5>
                  {account.gameName}#{account.tagLine}
                </h5>
                <p className="text-muted">PUUID:</p>
                <small>{account.puuid}</small>
              </div>
            )}

            {stats && (
              <div className="mt-3 p-3 border rounded text-center">
                <h5>Player Stats (Last 10 Matches)</h5>
                <p>
                  Most Played Champion:{" "}
                  <strong>{stats.mostPlayedChampion}</strong>
                </p>
                <p>
                  Most Played Position:{" "}
                  <strong>{stats.mostPlayedPosition}</strong>
                </p>
                <p>
                  Average KDA: <strong>{stats.avgKDA}</strong>
                </p>
              </div>
            )}

            {matches.length > 0 && (
              <div className="mt-4">
                <h5 className="text-center mb-3">
                  Last {matches.length} Matches
                </h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Champion</th>
                      <th>Position</th>
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
                        <td>{m.position}</td>
                        <td>{m.kills}</td>
                        <td>{m.deaths}</td>
                        <td>{m.assists}</td>
                        <td>{m.win ? "✔️" : "❌"}</td>
                        <td>
                          {m.deaths === 0
                            ? m.kills + m.assists // avoid division by zero
                            : ((m.kills + m.assists) / m.deaths).toFixed(2)}
                        </td>
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
