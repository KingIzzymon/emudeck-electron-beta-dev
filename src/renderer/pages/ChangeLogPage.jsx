import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'context/globalContext';
import Wrapper from 'components/molecules/Wrapper/Wrapper';
import Card from 'components/molecules/Card/Card';
import ChangeLog from 'components/organisms/Wrappers/ChangeLog';
import img0 from 'assets/emudeck_banner.png';
import img1 from 'assets/ui_banner.png';
import img2 from 'assets/melonds_banner.png';
import img3 from 'assets/dolphin_banner.png';
import img4 from 'assets/1x1.png';

const ChangeLogPage = () => {
  const { state, setState } = useContext(GlobalContext);
  const [statePage, setStatePage] = useState({
    disabledNext: false,
    disabledBack: false,
    current: 0,
    img: img0,
  });
  const { disabledNext, disabledBack, current, img } = statePage;
  const changeLogData = require('data/changelog.json');
  const imgC0 = img0;
  const activeItem = (id) => {
    let imgID;
    switch (id) {
      case 0:
        imgID = img0;
        break;
      case 1:
        imgID = img1;
        break;
      case 2:
        imgID = img2;
        break;
      case 3:
        imgID = img3;
        break;
      case 4:
        imgID = img4;
        break;
    }

    setStatePage({ ...statePage, current: id, img: imgID });
  };

  //Hide changelog after seen
  useEffect(() => {
    localStorage.setItem('show_changelog', false);
  }, []);

  return (
    <Wrapper>
      <ChangeLog disabledNext={disabledNext} disabledBack={disabledBack}>
        <div className="container--grid">
          <div data-col-sm="4">
            <div
              className="changelog-scroll"
              style={{
                height: '62vh',
                overflow: 'auto',
                overflowX: 'hidden',
                paddingRight: '20px',
              }}
            >
              <ul>
                {changeLogData.map((item, i) => {
                  return (
                    <li tabindex="0" key={i}>
                      <Card
                        css={current == i && 'is-selected'}
                        onClick={() => activeItem(i)}
                      >
                        <span className="h5">{item.title}</span>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div data-col-sm="8">
            {changeLogData.map((item, i) => {
              return (
                <div tabindex="0" key={i}>
                  {current == i && (
                    <Card
                      onClick={() => activeItem(i)}
                      css={current == i && 'is-selected'}
                    >
                      {item.image == 'true' && (
                        <div
                          style={{
                            maxHeight: 280,
                            overflow: 'hidden',
                            marginBottom: 10,
                            borderRadius: 10,
                          }}
                        >
                          <img src={img} alt="Image" />
                        </div>
                      )}
                      <p
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></p>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ChangeLog>
    </Wrapper>
  );
};

export default ChangeLogPage;
