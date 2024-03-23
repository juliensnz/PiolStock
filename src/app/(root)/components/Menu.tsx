import {InternalLink} from '@/app/(root)/components/common/InternalLink';
import {IS_MOBILE, theme} from '@/app/(root)/components/theme';
import {getColor, AkeneoIcon, ShopIcon, MainNavigationItem, AssetCollectionIcon} from 'akeneo-design-system';
import {usePathname} from 'next/navigation';
import styled from 'styled-components';

const MENU_WIDTH = 90;

const MainNavigation = styled.div`
  border-right: 1px solid ${getColor('grey', 80)};
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;

  ${IS_MOBILE} {
    bottom: 0;
    top: unset;
    flex-direction: row;
    height: unset;
    width: 100vw;
    align-items: center;
    z-index: 1;
    background: white;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  margin-bottom: 10px;
  background: white;

  ${IS_MOBILE} {
    display: none;
  }
`;
const StyledMainNavigationItem = styled(MainNavigationItem)`
  width: ${MENU_WIDTH}px;
`;

const Menu = () => {
  const pathName = usePathname();

  return (
    <MainNavigation>
      <Logo>
        <AkeneoIcon size={28} color={theme.color.brand100} />
      </Logo>
      <InternalLink href="/">
        <StyledMainNavigationItem icon={<AssetCollectionIcon />} active={pathName === '/'}>
          Stock
        </StyledMainNavigationItem>
      </InternalLink>
      <InternalLink href="/market">
        <StyledMainNavigationItem icon={<ShopIcon />} active={pathName.startsWith('/market')}>
          Market
        </StyledMainNavigationItem>
      </InternalLink>
    </MainNavigation>
  );
};

export {Menu, MENU_WIDTH};
