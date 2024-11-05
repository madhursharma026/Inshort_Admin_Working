import axios from "axios";
import Image from "next/image";
import { APIURL } from "./api/hello";
import { useRouter } from "next/router";
import Header from "./components/Header";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

const SingleArticle = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const GET_ARTICLE_BY_ID_QUERY = `
    query GetArticleById($id: Int!) {
      article(id: $id) {
        id
        title
        description
        imageURL
        createdAt
      }
    }
  `;

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        try {
          const response = await axios.post(APIURL, {
            query: GET_ARTICLE_BY_ID_QUERY,
            variables: { id: parseInt(id) }, // Ensure ID is an integer
          });
          setArticle(response.data.data.article);
        } catch (error) {
          console.error("Error fetching article:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-lg px-md-5 px-3 mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">No Article Found</h4>
          <p>
            We couldn't find the article you were looking for. It may have been
            removed or never existed.
          </p>
          <hr />
          <p className="mb-0">
            Please check the article list for available articles or return to
            the home page.
          </p>
          <div className="mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/viewarticles")}
            >
              Back to Articles
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
          <h1 className="text-center">{article.title}</h1>
          <Image
            src={article.imageURL}
            alt={article.title}
            width={600}
            height={400}
            className="card-img-top"
            style={{ objectFit: "cover", borderRadius: "0.5rem" }}
          />
          <div
            className="card-body"
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
          <p className="text-muted text-center">
            Published on: {new Date(article.createdAt).toLocaleDateString()}
          </p>
          {/* Centered Back Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/viewarticles")}
            >
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleArticle;
