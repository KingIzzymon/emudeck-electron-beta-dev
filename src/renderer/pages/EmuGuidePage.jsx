import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'context/globalContext';
import Wrapper from 'components/molecules/Wrapper/Wrapper';

import EmuGuide from 'components/organisms/Wrappers/EmuGuide';

const EmuGuidePage = () => {
  const { state, setState } = useContext(GlobalContext);
  const { installEmus, mode } = state;
  const { ryujinx } = installEmus;
  const emuData = require('data/emuData.json');
  const [statePage, setStatePage] = useState({
    disabledNext: false,
    disabledBack: false,
    showNotification: false,
    emulatorSelected: 'citra',
    textNotification: '',
    disableInstallButton: false,
    disableResetButton: false,
  });
  const {
    disabledNext,
    disabledBack,
    emulatorSelected,
    showNotification,
    textNotification,
    disableInstallButton,
    disableResetButton,
  } = statePage;

  //TODO: Use only one state for bioses, doing it this way is quick but madness
  const [ps1Bios, setps1Bios] = useState(null);
  const [ps2Bios, setps2Bios] = useState(null);
  const [switchBios, setSwitchBios] = useState(null);
  const [segaCDBios, setSegaCDBios] = useState(null);
  const [saturnBios, setSaturnBios] = useState(null);
  const [dreamcastBios, setDreamcastBios] = useState(null);
  const [DSBios, setDSBios] = useState(null);
  const ipcChannel = window.electron.ipcRenderer;
  const checkBios = (biosCommand) => {
    ipcChannel.sendMessage('emudeck', [`${biosCommand}|||${biosCommand}`]);
    ipcChannel.once(`${biosCommand}`, (status) => {
      // console.log({ biosCommand });
      status = status.stdout;
      //console.log({ status });
      status = status.replace('\n', '');
      let biosStatus;
      status.includes('true') ? (biosStatus = true) : (biosStatus = false);

      switch (biosCommand) {
        case 'checkPS1BIOS':
          setps1Bios(biosStatus);
          break;
        case 'checkPS2BIOS':
          setps2Bios(biosStatus);
          break;
        case 'checkYuzuBios':
          setSwitchBios(biosStatus);
          break;
        case 'checkSegaCDBios':
          setSegaCDBios(biosStatus);
          break;
        case 'checkSaturnBios':
          setSaturnBios(biosStatus);
          break;
        case 'checkDreamcastBios':
          setDreamcastBios(biosStatus);
          break;
        case 'checkDSBios':
          setDSBios(biosStatus);
          break;
      }
    });
  };

  const installEmu = (emulator, name) => {
    console.log(emulator);

    setStatePage({
      ...statePage,
      disableInstallButton: true,
    });

    ipcChannel.sendMessage('emudeck', [
      `${name}_install|||${name}_install && ${name}_init`,
    ]);

    ipcChannel.once(`${name}_install`, (status) => {
      // console.log({ status });
      status = status.stdout;
      //console.log({ status });
      status = status.replace('\n', '');
      //Lets check if it did install
      ipcChannel.sendMessage('emudeck', [
        `${name}_IsInstalled|||${name}_IsInstalled`,
      ]);

      ipcChannel.once(`${name}_IsInstalled`, (status) => {
        // console.log({ status });
        status = status.stdout;
        console.log({ status });
        status = status.replace('\n', '');

        if (status.includes('true')) {
          setStatePage({
            ...statePage,
            textNotification: `${name} installed! 🎉`,
            showNotification: true,
            disableInstallButton: false,
          });
          //We set the emu as install = yes
          // setState({
          //   ...state,
          //   installEmus: {
          //     ...installEmus,
          //     [emulator]: {
          //       id: emulator,
          //       name: name,
          //       status: true,
          //     },
          //   },
          // });
        } else {
          setStatePage({
            ...statePage,
            textNotification: `There was an issue trying to install ${name} 😥`,
            showNotification: true,
            disableInstallButton: false,
          });
        }
      });
    });
  };

  const uninstallEmu = (emulator, name, alternative = false) => {
    console.log(emulator);

    if (
      confirm(
        'Are you sure you want to uninstall? Your saved games will be deleted'
      )
    ) {
      // Uninstall it!

      setStatePage({
        ...statePage,
        disableInstallButton: true,
      });
      if (alternative) {
        ipcChannel.sendMessage('emudeck', [
          `${name}_uninstall|||${name}_uninstall_alt`,
        ]);
      } else {
        ipcChannel.sendMessage('emudeck', [
          `${name}_uninstall|||${name}_uninstall`,
        ]);
      }

      ipcChannel.once(`${name}_uninstall`, (status) => {
        // console.log({ status });
        status = status.stdout;
        //console.log({ status });
        status = status.replace('\n', '');
        //Lets check if it did install
        ipcChannel.sendMessage('emudeck', [
          `${name}_IsInstalled|||${name}_IsInstalled`,
        ]);

        ipcChannel.once(`${name}_IsInstalled`, (status) => {
          // console.log({ status });
          status = status.stdout;
          console.log({ status });
          status = status.replace('\n', '');

          if (status.includes('false')) {
            setStatePage({
              ...statePage,
              textNotification: `${name} Uninstalled! 🎉`,
              showNotification: true,
              disableInstallButton: false,
            });
            //We set the emu as install = no
            // setState({
            //   ...state,
            //   installEmus: {
            //     ...installEmus,
            //     [emulator]: {
            //       id: emulator,
            //       name: name,
            //       status: false,
            //     },
            //   },
            // });
          } else {
            setStatePage({
              ...statePage,
              textNotification: `There was an issue trying to uninstall ${name} 😥`,
              showNotification: true,
              disableInstallButton: false,
            });
          }
        });
      });
    } else {
      // Do nothing!
    }
  };

  const resetEmu = (emulator, name) => {
    setStatePage({
      ...statePage,
      disableInstallButton: true,
    });
    ipcChannel.sendMessage('emudeck', [
      `${name}_resetConfig|||${name}_resetConfig`,
    ]);
    ipcChannel.once(`${name}_resetConfig`, (status) => {
      console.log(`${name}_resetConfig`);
      status = status.stdout;
      console.log({ status });
      status = status.replace('\n', '');

      if (status.includes('true')) {
        setStatePage({
          ...statePage,
          textNotification: `${name} configuration reset to EmuDeck's defaults! 🎉`,
          showNotification: true,
          disableResetButton: false,
        });
      } else {
        setStatePage({
          ...statePage,
          textNotification: `There was an issue trying to reset ${name} configuration 😥`,
          showNotification: true,
          disableResetButton: false,
        });
      }
    });
  };

  useEffect(() => {
    if (showNotification === true) {
      setTimeout(() => {
        setStatePage({
          ...statePage,
          showNotification: false,
        });
      }, 3000);
    }
  }, [showNotification]);

  useEffect(() => {
    checkBios('checkPS1BIOS');
    checkBios('checkPS2BIOS');
    checkBios('checkYuzuBios');
    checkBios('checkSegaCDBios');
    checkBios('checkSaturnBios');
    checkBios('checkDSBios');
    checkBios('checkDreamcastBios');
  }, []);

  const selectEmu = (e) => {
    const emu = e.target.value;
    if (emu != '-1') {
      setStatePage({
        ...statePage,
        emulatorSelected: emu,
      });
    }
  };

  return (
    <Wrapper>
      <>
        <EmuGuide
          mode={mode}
          disabledNext={disabledNext}
          disabledBack={disabledBack}
          emuData={emuData[emulatorSelected]}
          ps1={ps1Bios}
          ps2={ps2Bios}
          nswitch={switchBios}
          segacd={segaCDBios}
          saturn={saturnBios}
          dreamcast={dreamcastBios}
          nds={DSBios}
          onChange={selectEmu}
          onClick={resetEmu}
          onClickInstall={installEmu}
          onClickUninstall={uninstallEmu}
          showNotification={showNotification}
          textNotification={textNotification}
          installEmus={installEmus[emulatorSelected]}
          disableInstallButton={disableInstallButton ? true : false}
          disableResetButton={disableResetButton ? true : false}
        />
      </>
    </Wrapper>
  );
};

export default EmuGuidePage;
