import * as React from "react";
import { Form, Input, Modal } from "antd";
import { fetchAPI } from "../../utils/FetchUtil";
import endpoints from "../../config/endpoints";
import Notification from "../../utils/Notification";
import { FormattedMessage } from "react-intl";
import Logging from "../../utils/Logging";

export default function UniqueNameModal({ visible, onCancel, onSuccess }) {
  const [ name, setName ] = React.useState("");
  const [ loading, setLoading ] = React.useState(false);

  const onInputChange = React.useCallback(e => setName(e.target.value), []);

  const onSubmit = React.useCallback(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await fetchAPI(
          endpoints.CREATE_COUNTRY_NAME,
          "POST",
          { name }
        );
  
        if (!response?.isSuccess) {
          if (response?.json?.message) {
            Notification.displayErrorMessage(
              <FormattedMessage
                id={response.json.message}
                defaultMessage="Error while creating name, please try again later"
              />
            );
  
            throw Error(response.json.message);
          }
  
          Notification.displayErrorMessage(
            <FormattedMessage
              id="createCountry.uniqueName.create.notifications.error"
              defaultMessage="Error while creating name, please try again later"
            />
          );
  
          throw Error("Error while creating name");
        }

        Notification.displaySuccessMessage(
          <FormattedMessage
            id="createCountry.uniqueName.create.notifications.success"
            defaultMessage="Name has been created"
          />
        );

        onSuccess(response.name);
      } catch (error) {
        Logging.Error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [ name ]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={loading}
    >
      <div className="field">
        <label>Name</label>
        <p className="label-explaination">This name is used as a handle for your country. It determines the URL where your country is found.</p>
        <Input
          placeholder="e.g Liberland"
          type="text"
          name="countryName"
          onChange={onInputChange}
          value={name}
          size="large"
        />
      </div>
    </Modal>
  );
}
