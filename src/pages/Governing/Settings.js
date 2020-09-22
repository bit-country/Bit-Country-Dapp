import React, { useEffect, useState, useCallback } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Form, Tooltip, Switch, Icon, Col, Divider } from "antd";
import Logging from "../../utils/Logging";

function Settings(props) {
  const { intl } = props;
  const [ isStakeEnabled, setStakeStatus ] = useState(true);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        //todo
        //the end point.
        /*
                const response = await fetchAPI(

                );

                if (!response?.isSuccess) {
                    throw Error("Error while retrieving settings");
                }*/

        //todo
        //set state.

        setLoading(false);
      } catch (error) {
        Logging.Error(error);
      }
    })();
  }, []);

  const handleSkateStatusChange = useCallback(checked => {
    setStakeStatus(checked);
  },[]);

  return (
    <Col offset={4} span={16}>
      <h2>
        <FormattedMessage id="country.stake.settings.title" />
      </h2>
      <Divider />
      <Form
        labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          label={intl.formatMessage({ id: "country.stake.settings.enableStake.label" })}>
          <Switch
            loading={loading}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={isStakeEnabled}
            onChange={handleSkateStatusChange}
          />
          <Tooltip title={intl.formatMessage({ id: "country.stake.settings.enableStake.discription" })}>
            <a style={{ margin: "0 8px" }}><Icon type="question-circle" /></a>
          </Tooltip>
        </Form.Item>
      </Form>
    </Col>
  );
}

export default injectIntl(Settings);