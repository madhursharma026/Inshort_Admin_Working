import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./components/Header";
import { APIURL } from "./api/hello";
import { Button, Spinner } from "react-bootstrap";

const REPORTED_NEWS_QUERY = `
  query {
    reports {
      id
      details
      newsId
      timesReported
      news {
        id
        url
        title
        author
        status
        priority
        language
        sourceURL
        description
        publishedAt
        readMoreContent
        sourceURLFormate
      }
    }
  }
`;

const UPDATE_NEWS_MUTATION = `
  mutation UpdateNews($id: Int!, $updateNewsInput: UpdateNewsInput!) {
    updateNews(id: $id, updateNewsInput: $updateNewsInput) {
      id
        url
        title
        author
        status
        priority
        language
        sourceURL
        description
        publishedAt
        readMoreContent
        sourceURLFormate
    }
  }
`;

const ReportedNews = () => {
  const router = useRouter();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchReportedNews = async () => {
      try {
        const response = await axios.post(APIURL, {
          query: REPORTED_NEWS_QUERY,
        });
        const reports = response.data.data.reports;
        const news = reports.map((report) => ({
          ...report.news,
          timesReported: report.timesReported,
          details: report.details, // Include the details in the news data
        }));
        setNewsData(news);
      } catch (error) {
        console.error("Error fetching reported news:", error);
        setError("Failed to fetch reported news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportedNews();
  }, []);

  const handleToggleStatus = async (newsId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.post(APIURL, {
        query: UPDATE_NEWS_MUTATION,
        variables: {
          id: newsId,
          updateNewsInput: { status: newStatus },
        },
      });
      // Update the specific news item in the state
      setNewsData((prevData) =>
        prevData.map((news) =>
          news.id === newsId ? { ...news, status: newStatus } : news
        )
      );
      alert(
        `News ${
          currentStatus === "active" ? "deleted" : "restored"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating news status:", error);
      setError("Failed to update the news status. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container-lg px-md-5 px-3 mt-3">
        <h1 className="mb-4 text-center">
          <u>Reported News ({newsData.length})</u>
        </h1>

        {newsData.length === 0 ? (
          <div className="text-center">No reported news available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th style={{ minWidth: "200px" }}>News Title</th>
                  <th
                    className="d-none d-lg-table-cell"
                    style={{ minWidth: "300px" }}
                  >
                    Report Description
                  </th>
                  <th style={{ minWidth: "150px" }}>Times Reported</th>
                  <th
                    className="d-none d-xl-table-cell"
                    style={{ minWidth: "100px" }}
                  >
                    Read More
                  </th>
                  <th style={{ minWidth: "100px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {newsData.map((news) => (
                  <tr key={news.id}>
                    <td>{news.title}</td>
                    <td className="d-none d-lg-table-cell">{news.details}</td>
                    <td
                      style={{
                        fontWeight: news.timesReported > 10 ? "bold" : "normal",
                      }}
                    >
                      {news.timesReported}
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <Link
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read More
                      </Link>
                    </td>
                    <td>
                      <Button
                        variant={
                          news.status === "active" ? "danger" : "success"
                        }
                        onClick={() => handleToggleStatus(news.id, news.status)}
                      >
                        {news.status === "active" ? "Delete" : "Restore"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportedNews;
