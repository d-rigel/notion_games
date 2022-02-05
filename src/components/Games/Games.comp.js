import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./games.comp.css";
import Game from "../SingleGame/Game.comp";
import axios from "axios";

function Games() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const [sortStatus, setSortStatus] = useState("all");

  //handling search in the search input
  const handleSearch = (e) => {
    let value = e.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      //search by name because no title
      return data.name.search(value) !== -1;
    });
    setFilteredData(result);
  };

  //handling sorting
  const handleSort = (e) => {
    // let value = e.target.value.toLowerCase()
    if (sortStatus === "release") {
      allData.sort((a, b) => {
        if (a.release < b.release) return -1;
        if (a.release > b.release) return 1;
        return 0;
      });
    } else if (sortStatus === "ratings") {
      allData.sort((a, b) => {
        if (a.release > b.release) return -1;
        if (a.release < b.release) return 1;
        return 0;
      });
    }
  };

  //reseting the inputs without api call
  const resetState = (e) => {
    e.preventDefault();

    e.target.elements.text.value = " ";
    e.target.elements.selectOpt.value = "";
  };

  //making api when page renders
  useEffect(() => {
    axios
      .get("https://adaorachi.github.io/esetech-assessment-api/game-data.json")
      .then((res) => {
        setAllData(res.data);
        setFilteredData(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(`Error fetching data ${error}`);
      });
  }, []);

  return (
    <div className="games">
      <Container className="p-5">
        <Row>
          <>
            <Col sm={4}>
              <div className="games__form p-5">
                <h5 className="form__heading mb-4 ">Filter Results</h5>
                <Form onSubmit={resetState}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                      Name (contains)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      placeholder="Text string"
                      className="form-control"
                      onChange={(e) => handleSearch(e)}
                    />
                  </Form.Group>

                  <Form.Label className="form-label">Order By</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    className="select-custom"
                    name="selectOpt"
                    onChange={(e) => handleSort(e.target.value)}>
                    <option value="all">all</option>
                    <option value="release">release-dates</option>
                    <option value="ratings">ratings</option>
                  </Form.Select>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 py-2 px-4 float-end custom-btn">
                    Clear
                  </Button>
                </Form>
              </div>
            </Col>

            <Col sm={8}>
              <div className="games__items">
                {filteredData.map((game) => (
                  <Game
                    name={game.name}
                    key={game.id}
                    date={game.first_release_date}
                    summary={game.summary}
                  />
                ))}
              </div>
            </Col>
          </>
        </Row>
      </Container>
    </div>
  );
}

export default Games;
