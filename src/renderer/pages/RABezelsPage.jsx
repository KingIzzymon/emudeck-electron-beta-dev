import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'context/globalContext';
import Wrapper from 'components/molecules/Wrapper/Wrapper';

import RABezels from 'components/organisms/Wrappers/RABezels';

const RABezelsPage = () => {
  const { state, setState } = useContext(GlobalContext);
  const { bezels } = state;
  const [statePage, setStatePage] = useState({
    disabledNext: false,
    disabledBack: false,
    data: '',
  });
  const { disabledNext, disabledBack, data } = statePage;
  const bezelsSet = (bezelStatus) => {
    setState({
      ...state,
      bezels: bezelStatus,
    });
  };
  //Enabling button when changing the global state only if we have a device selected
  useEffect(() => {
    if (bezels != '') {
      setStatePage({ ...statePage, disabledNext: false });
    }
  }, [state]); // <-- here put the parameter to listen

  return (
    <Wrapper>
      <RABezels
        data={data}
        disabledNext={disabledNext}
        disabledBack={disabledBack}
        onClick={bezelsSet}
      />
    </Wrapper>
  );
};

export default RABezelsPage;
