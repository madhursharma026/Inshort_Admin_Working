import axios from "axios";
import Image from "next/image";
import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import Header from "./components/Header";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

const SingleNews = () => {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const GET_NEWS_BY_ID_QUERY = `
    query GetNewsById($id: Int!) {
      newsById(id: $id) {
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

  useEffect(() => {
    const fetchNews = async () => {
      if (id) {
        try {
          const response = await axios.post(APIURL, {
            query: GET_NEWS_BY_ID_QUERY,
            variables: { id: parseInt(id) }, // Ensure ID is an integer
          });
          setNews(response.data.data.newsById);
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading news...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container-lg px-md-5 px-3 mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">No News Found</h4>
          <p>
            We couldn't find the news you were looking for. It may have been
            removed or never existed.
          </p>
          <hr />
          <p className="mb-0">
            Please check the news list for available articles or return to the
            home page.
          </p>
          <div className="mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/")}
            >
              Back to News
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container-lg px-md-5 px-3 mt-5">
        <div className="card shadow-lg p-3 mb-5 bg-white rounded">
          <h1 className="text-center">{news.title}</h1>
          {news.sourceURL && (
            <Image
              src={news.sourceURL}
              alt={news.title}
              width={600}
              height={400}
              className="card-img-top"
              style={{ objectFit: "cover", borderRadius: "0.5rem" }}
            />
          )}
          <div
            className="card-body"
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
          <p className="text-muted text-center">
            Published on: {new Date(news.publishedAt).toLocaleDateString()}
          </p>
          {news.readMoreContent && (
            <div className="text-center mt-3">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Read More
              </a>
            </div>
          )}
          {/* Centered Back Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/")}
            >
              Back to News
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleNews;
