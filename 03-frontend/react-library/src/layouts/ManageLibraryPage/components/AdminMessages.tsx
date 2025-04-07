import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMeassge";

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${
          process.env.REACT_APP_API
        }/messages/search/findByClosed?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;

        const requestOptions = {
          method: "GET",
          hedaers: {
            Authorization: `Bearer ${authState.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messageResponse = await fetch(url, requestOptions);
        if (!messageResponse.ok) {
          throw new Error("Something went wrong");
        }

        const messageResponseJson = await messageResponse.json();

        setMessages(messageResponseJson._embedded.messages);
        setTotalPages(messageResponseJson.page.totalPages);
      }
      setIsLoadingMessages(false);
    };
    fetchUserMessages().catch((error: any) => {
      setHttpError(error.message);
      setIsLoadingMessages(false);
    });
  }, [authState, currentPage, btnSubmit]);

  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function submitResponseToQuestion(id: number, response: string) {
    const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;

    const messageAdminRequestModel: AdminMessageRequest =
      new AdminMessageRequest(id, response);

    console.log("yes");
    console.log(authState?.accessToken);
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(messageAdminRequestModel),
    };

    const messageAdminRequestModelResponse = await fetch(url, requestOptions);

    if (!messageAdminRequestModelResponse.ok) {
      throw new Error("Something went wrong");
    }

    setBtnSubmit(!btnSubmit);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A:</h5>

          {messages.map((message) => (
            // <p>Question that need a response {message.id}</p>
            <AdminMessage
              message={message}
              key={message.id}
              submitResponseToQuestion={submitResponseToQuestion}
            />
          ))}
        </>
      ) : (
        <>
          <h5>Pending Q/A:</h5>
        </>
      )}

      <div className="mt-3">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};
