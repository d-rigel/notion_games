import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./games.comp.css";
import Game from "../SingleGame/Game.comp";
import axios from "axios";
import { Pagination } from "../paginate/Pagination.comp";

function Games() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [sortType, setSortType] = useState("all");

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

  //reseting the inputs without api call

  const resetState = (e) => {
    e.preventDefault();
    e.target.elements.text.value = "";
    e.target.elements.selectOpt.value = "";

    setFilteredData(allData);
  };

  //making api when page renders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(
        "https://adaorachi.github.io/esetech-assessment-api/game-data.json"
      );
      setAllData(res.data);
      setFilteredData(res.data);
    };
    // axios
    //   .get("https://adaorachi.github.io/esetech-assessment-api/game-data.json")
    //   .then((res) => {
    //     setAllData(res.data);
    //     setFilteredData(res.data);
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(`Error fetching data ${error}`);
    //   });
    fetchData();
  }, []);

  //handling sorting
  useEffect(() => {
    const sortArray = (type) => {
      const types = {
        first_release_date: "first_release_date",
        rating: "rating",
      };
      const sortProperty = types[type];
      const sorted = [...allData].sort(
        (a, b) => b[sortProperty] - a[sortProperty]
      );
      setFilteredData(sorted);
    };
    sortArray(sortType);
  }, [sortType]);

  //Get current data
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    onChange={(e) => setSortType(e.target.value)}>
                    <option value=""></option>
                    <option value="first_release_date">release-dates</option>
                    <option value="rating">ratings</option>
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
                {/* {filteredData.map((game) => (
                  <Game
                    loading={loading}
                    name={game.name}
                    key={game.id}
                    date={game.first_release_date}
                    summary={game.summary}
                  />
                ))} */}
                {currentData.map((game) => (
                  <Game
                    loading={loading}
                    name={game.name}
                    key={game.id}
                    date={game.first_release_date}
                    summary={game.summary}
                  />
                ))}
                <Pagination
                  dataPerPage={dataPerPage}
                  totalData={filteredData.length}
                  paginate={paginate}
                />
              </div>
            </Col>
          </>
        </Row>
      </Container>
    </div>
  );
}

export default Games;
