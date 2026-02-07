import {
  Fragment,
  memo,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLocation, useNavigate } from "react-router";

import clsx from "clsx";

import {
  DrawerCollapseChildrenContentStyled,
  DrawerCollapseChildrenStyled,
  DrawerCollapseStyled,
  DrawerContentStyled,
  DrawerStyled,
  DrawerSwitchButtonStyled,
  LogoWrapperStyled,
  MenuItemListSideBar,
  PopupDrawerContentStyled,
} from "@core/app-shell/components/drawer/BaseDrawerDesktop.styled";
import { styled } from "@mui/material/styles";
import Tooltip, {
  tooltipClasses,
  type TooltipProps,
} from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

const iconWidth = 57;

export type IBaseDrawerDesktopListItem = {
  id: number;
  icon?: ReactNode;
  text: string;
  path?: string;
  children?: IBaseDrawerDesktopListItem[];
};

export type IBaseDrawerDesktopProps = {
  listItems: IBaseDrawerDesktopListItem[];
  switchIcon?: ReactNode;
};

export type IBaseDrawerChildProps = {
  item: IBaseDrawerDesktopListItem;
  isChild?: boolean;
  isOpenDrawer?: boolean;
};

export type IPopupDrawerProps = {
  listItems: IBaseDrawerDesktopListItem[];
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--mui-palette-background-paper)",
    color: "var(--mui-palette-text-primary)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid var(--mui-palette-divider)",
  },
}));

const PopupDrawer = ({ listItems }: IPopupDrawerProps) => {
  const navigate = useNavigate();

  const handleSwitchRoute = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <PopupDrawerContentStyled>
      {listItems.map((item, index) => {
        const active = item.path && location.pathname.includes(item.path);
        return (
          <div
            key={`${item.text}_${index}`}
            className="item_popup flex items-center gap-2 group"
            onClick={() => handleSwitchRoute(item.path)}
          >
            <div
              className={clsx(
                "w-2 h-2 bg-gray-200 rounded-full group-hover:bg-primary",
                {
                  "bg-primary": active,
                }
              )}
            />
            <p
              className={clsx(
                "group-hover:text-primary text-base font-medium",
                {
                  "text-primary": active,
                }
              )}
            >
              {item.text}
            </p>
          </div>
        );
      })}
    </PopupDrawerContentStyled>
  );
};

const BaseDrawerChild = ({
  item,
  isChild,
  isOpenDrawer,
}: IBaseDrawerChildProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const [drawerHeight, setDrawerHeight] = useState(0);

  const refDrawer = useRef<HTMLDivElement>(null);

  const effect = useEffectEvent((item: IBaseDrawerDesktopListItem) => {
    if (!item.children) return;

    setDrawerHeight(refDrawer.current?.clientHeight ?? 0);

    if (
      item.children.some(
        child => child.path && location.pathname.includes(child.path)
      )
    ) {
      setSelectedItem(item.id);
    }
  });

  useEffect(() => {
    effect(item);
  }, [location, item]);

  const handleChangeStateCollapse = () => {
    if (!isOpenDrawer) return;

    setSelectedItem(prev => (prev ? null : item.id));
  };

  const handleSwitchRoute = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const Component = isOpenDrawer ? Fragment : HtmlTooltip;

  if (item.children && item.children.length > 0) {
    return (
      <DrawerCollapseChildrenStyled
        orientation="vertical"
        in={!!selectedItem}
        collapsedSize={drawerHeight}
      >
        <Component
          title={<PopupDrawer listItems={item.children} />}
          placement="right"
        >
          <MenuItemListSideBar
            role="menuitem"
            className={clsx(
              {
                active: item.children.some(
                  child => child.path && location.pathname.includes(child.path)
                ),
              },
              "mt-1"
            )}
            ref={refDrawer}
            onClick={handleChangeStateCollapse}
          >
            <>
              <div className="icon">{item.icon}</div>
              {isOpenDrawer && (
                <>
                  <Typography>{item.text}</Typography>
                  <div className={`${selectedItem ? "open" : "close"}`}>
                    <ExpandMore />
                  </div>
                </>
              )}
            </>
          </MenuItemListSideBar>
        </Component>

        {isOpenDrawer && (
          <DrawerCollapseChildrenContentStyled>
            {item.children.map((child, index) => (
              <BaseDrawerChild
                key={`${child.text}_${index}`}
                item={child}
                isChild={true}
                isOpenDrawer={isOpenDrawer}
              />
            ))}
          </DrawerCollapseChildrenContentStyled>
        )}
      </DrawerCollapseChildrenStyled>
    );
  }

  return (
    <Tooltip
      title={item.text}
      placement="right"
      disableHoverListener={isOpenDrawer}
    >
      <MenuItemListSideBar
        role="menuitem"
        className={clsx({
          active:
            !isChild && item.path !== "/"
              ? item.path && location.pathname.includes(item.path)
              : item.path === location.pathname,
          ["active-child"]:
            isChild && location.pathname.includes(item.path ?? ""),
        })}
        onClick={() => handleSwitchRoute(item?.path)}
      >
        <div className="icon">{item.icon}</div>
        {isOpenDrawer && (
          <>
            <Typography>{item.text}</Typography>
          </>
        )}
      </MenuItemListSideBar>
    </Tooltip>
  );
};

const BaseDrawerDesktop = ({
  listItems,
  switchIcon,
}: IBaseDrawerDesktopProps) => {
  const navigate = useNavigate();
  const [isOpenDrawer, setIsOpenDrawer] = useState(true);

  const handleToggleDrawer = () => {
    setIsOpenDrawer(prev => !prev);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <DrawerStyled>
      <DrawerSwitchButtonStyled onClick={handleToggleDrawer}>
        {switchIcon || (
          <ArrowBackIos
            sx={{
              color: "var(--mui-palette-common-white)",
              width: 12,
              height: 12,
              position: "relative",
              left: isOpenDrawer ? 2 : -2,
              transformOrigin: "center",
              transition: "all 0.2s",
              transform: !isOpenDrawer ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </DrawerSwitchButtonStyled>
      <DrawerCollapseStyled
        orientation="horizontal"
        in={isOpenDrawer}
        collapsedSize={iconWidth}
      >
        <LogoWrapperStyled onClick={handleGoHome}>
          <img
            src={"/images/logo.png"}
            alt="Smart CFO Logo"
            style={{
              width: isOpenDrawer ? "fit-content" : 40,
              height: !isOpenDrawer ? "auto" : "fit-content",
              transition: "width 0.2s",
              margin: "0 auto",
              display: "block",
            }}
          />
        </LogoWrapperStyled>

        <div className="h-3" />

        <DrawerContentStyled isOpenDrawer={isOpenDrawer} role="presentation">
          {listItems.map((item, index) => (
            <BaseDrawerChild
              key={`${item.text}_${item.id}_${index}`}
              isOpenDrawer={isOpenDrawer}
              item={item}
            />
          ))}
        </DrawerContentStyled>
      </DrawerCollapseStyled>
    </DrawerStyled>
  );
};

export default memo(BaseDrawerDesktop);
