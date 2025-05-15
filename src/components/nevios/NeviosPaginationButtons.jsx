import { Box, Button } from "@mui/material";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

export default function NeviosPaginationButtons({
    previousButtonOnClick = () => {},
    nextButtonOnClick = () => {},
    previousButtonIcon = <TbChevronLeft />,
    nextButtonIcon = <TbChevronRight />
}) {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
                variant="contained"
                color="shadow"
                sx={{
                    borderRadius: "12px",
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                    padding: 0,
                }}
                onClick={previousButtonOnClick}>
                {previousButtonIcon}
            </Button>
            <Button
                variant="contained"
                color="shadow"
                sx={{
                    borderRadius: "12px",
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                    padding: 0,
                }}
                onClick={nextButtonOnClick}>
                {nextButtonIcon}
            </Button>
        </Box>
    )
}