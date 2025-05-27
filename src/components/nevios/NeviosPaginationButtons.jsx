import { Box, Tooltip } from "@mui/material";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { NeviosSecondaryIconButton } from "./NeviosButtons";
export default function NeviosPaginationButtons({
    previousButtonOnClick = () => {},
    nextButtonOnClick = () => {},
    previousButtonIcon = <TbChevronLeft />,
    nextButtonIcon = <TbChevronRight />
}) {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Previous" placement="top">
                <NeviosSecondaryIconButton
                    onClick={previousButtonOnClick}>
                    {previousButtonIcon}
                </NeviosSecondaryIconButton>
            </Tooltip>
            <Tooltip title="Next" placement="top">
                <NeviosSecondaryIconButton
                    onClick={nextButtonOnClick}>
                    {nextButtonIcon}
                </NeviosSecondaryIconButton>
            </Tooltip>
        </Box>
    )
}