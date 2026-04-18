import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const dealer_url = "/djangoapp/get_dealers/";
  const dealer_url_by_state = "/djangoapp/get_dealers/";

  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();

      console.log("DEALERS RESPONSE:", retobj);

      if (retobj.status === 200) {
        const all_dealers = Array.isArray(retobj.dealers)
          ? retobj.dealers
          : [];

        const all_states = all_dealers.map((dealer) => dealer.state);

        setStates([...new Set(all_states)]);
        setDealersList(all_dealers);
      } else {
        setDealersList([]);
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      setDealersList([]);
    }
  };

  const filterDealers = async (state) => {
    try {
      if (state === "All") {
        get_dealers();
        return;
      }

      const res = await fetch(`${dealer_url_by_state}${state}/`);
      const retobj = await res.json();

      console.log("FILTER RESPONSE:", retobj);

      if (retobj.status === 200) {
        const state_dealers = Array.isArray(retobj.dealers)
          ? retobj.dealers
          : [];

        setDealersList(state_dealers);
      } else {
        setDealersList([]);
      }
    } catch (error) {
      console.error("Error filtering dealers:", error);
      setDealersList([]);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                name="state"
                onChange={(e) => filterDealers(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled hidden>
                  State
                </option>
                <option value="All">All States</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </th>

            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>

        <tbody>
          {dealersList.map((dealer) => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>

              <td>
                <Link to={`/dealer/${dealer.id}`}>
                  {dealer.full_name}
                </Link>
              </td>

              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>

              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img
                      src={review_icon}
                      className="review_icon"
                      alt="Post Review"
                    />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;