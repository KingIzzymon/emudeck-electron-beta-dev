import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'context/globalContext';
import Wrapper from 'components/molecules/Wrapper/Wrapper';

import EmulatorSelector from 'components/organisms/Wrappers/EmulatorSelector';

import {
  imgdefault,
  imgra,
  imgdolphin,
  imgprimehack,
  imgppsspp,
  imgduckstation,
  imgcitra,
  imgpcsx2,
  imgrpcs3,
  imgyuzu,
  imgryujinx,
  imgcemu,
  imgxemu,
  imgmame,
  imgvita3k,
  imgxenia,
  imgsrm,
  imgrmg,
  imgscummvm,
  imgsupermodelista,
  imgesde,
  imgmelonds,
  imgmgba,
} from 'components/utils/images/images';

const images = {
  ra: imgra,
  dolphin: imgdolphin,
  primehack: imgprimehack,
  ppsspp: imgppsspp,
  duckstation: imgduckstation,
  citra: imgcitra,
  pcsx2: imgpcsx2,
  rpcs3: imgrpcs3,
  yuzu: imgyuzu,
  melonds: imgmelonds,
  ryujinx: imgryujinx,
  cemu: imgcemu,
  xemu: imgxemu,
  mame: imgmame,
  vita3k: imgvita3k,
  scummvm: imgscummvm,
  supermodelista: imgsupermodelista,
  esde: imgesde,
  rmg: imgrmg,
  mgba: imgmgba,
  xenia: imgxenia,
  srm: imgsrm,
};

const EmulatorSelectorPage = () => {
  const { state, setState } = useContext(GlobalContext);
  const { device, installEmus } = state;

  const [statePage, setStatePage] = useState({
    disabledNext: false,
    disabledBack: false,
    data: '',
  });
  const { disabledNext, disabledBack, data } = statePage;

  const toggleEmus = (emulatorProp) => {
    let { id, name, status } = installEmus[emulatorProp];

    setState({
      ...state,
      installEmus: {
        ...installEmus,
        [emulatorProp]: { ...installEmus[emulatorProp], status: !status },
      },
    });
  };

  return (
    <Wrapper>
      <EmulatorSelector
        data={data}
        onClick={toggleEmus}
        disabledNext={disabledNext}
        disabledBack={disabledBack}
        images={images}
      />
    </Wrapper>
  );
};

export default EmulatorSelectorPage;
