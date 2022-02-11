import React from "react";
import "./game.css";
import moment from "moment";

function Game({ name, date, summary }) {
  let newDate = new Date();
  const weekday = date;
  newDate.setTime(weekday);

  return (
    <>
      <div className="games__item">
        <div className="games__item-img"></div>
        <div className="games__item-details">
          <div className="item">
            <h3 className="item__name">{name}</h3>
            <p className="item__date">
              Release Date: {moment(newDate).format("YYYY-MM-DD HH:m:s")}
            </p>
          </div>
          <p className="item__desc">{summary}</p>
        </div>
      </div>
    </>
  );
}

export default Game;
