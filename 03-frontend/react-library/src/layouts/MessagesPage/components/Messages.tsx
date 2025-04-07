import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const Messages = () => {
  const { authState } = useOktaAuth();

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/search/findByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=${messagesPerPage}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messageResponse = await fetch(url, requestOptions);
        const messageResponseJson = await messageResponse.json();

        setMessages(messageResponseJson._embedded.messages);
        setIsLoading(false);
        setTotalPages(messageResponseJson.page.totalPages);
      }
    };
    fetchMessages().catch((error: any) => {
      setHttpError(error);
      setIsLoading(false);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage]);

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return <div className="container m-5">{httpError}</div>;
  }
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A:</h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 p-3 shadow bg-body rounded">
                <h5>
                  Case #{message.id}:{message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <div>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </div>
                  ) : (
                    <p>
                      <i>
                        Pending response from Administration. Please be patient
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h5>All question you submit will be shown here</h5>
        </>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
