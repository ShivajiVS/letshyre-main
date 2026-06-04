import React from "react";
import { Helmet } from "react-helmet-async";

import { useScoreCardsList } from "@/hooks/employee/useScoreCardsList";
import { ScoreCardItem } from "./components/score-cards/ScoreCardItem";
import { ScoreCardsSkeleton } from "./components/score-cards/ScoreCardsSkeleton";
import { EmptyScoreCards } from "./components/score-cards/EmptyScoreCards";
import "./styles/score-cards-list.css";

export function ScoreCardsList() {
  const { data, isLoading, isError, error } = useScoreCardsList();

  const is404 =
    error?.response?.status === 404 ||
    data?.status === 404 ||
    (data?.data && data.data.length === 0);
  const scoreCards = data?.data || [];

  return (
    <>
      <Helmet>
        <title>My Score Cards | LetsHyre</title>
        <meta
          name="description"
          content="View your interview performance score cards and feedback."
        />
      </Helmet>

      <div className="sc-list-wrapper">
        <div className="sc-list-header">
          <h2>My Score Cards</h2>
          <p>Review your interview performances and AI-generated feedback.</p>
        </div>

        {isLoading ? (
          <div className="sc-list-grid">
            <ScoreCardsSkeleton count={3} />
          </div>
        ) : is404 || scoreCards.length === 0 ? (
          <EmptyScoreCards />
        ) : isError ? (
          <div className="sc-empty-state">
            <h3 className="sc-empty-title">Failed to load score cards</h3>
            <p className="sc-empty-desc">Please try again later.</p>
          </div>
        ) : (
          <div className="sc-list-grid">
            {scoreCards.map((scorecard) => (
              <ScoreCardItem key={scorecard.id} scorecard={scorecard} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
