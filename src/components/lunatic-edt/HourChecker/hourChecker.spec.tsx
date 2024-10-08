import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { ThemeProvider } from "@mui/material";
import HourChecker from "./HourChecker";
import { theme } from "../../../theme/theme";

describe("hourchecker", () => {
    const responses = [
        {
            id: "1",
            label: "16h15",
            response: { name: "16h15" },
        },
        {
            id: "2",
            label: "16h30",
            response: { name: "16h30" },
        },
        {
            id: "3",
            label: "16h45",
            response: { name: "16h45" },
        },
        {
            id: "4",
            label: "17h00",
            response: { name: "17h00" },
        },
    ];

    const renderElement = (value: { [key: string]: boolean }, handleChange: any): RenderResult => {
        return render(
            <ThemeProvider theme={theme}>
                <HourChecker
                    handleChange={handleChange}
                    responses={responses}
                    value={value}
                    idSurvey={""}
                ></HourChecker>
            </ThemeProvider>,
        );
    };

    it("displays the four quarters and toogles", async () => {
        const value = {
            "16h15": false,
            "16h30": false,
            "16h45": false,
            "17h00": false,
        };
        const handleChange = jest.fn();
        renderElement(value, handleChange);

        expect(screen.getByText(responses[0].label)).toBeInTheDocument();
        expect(screen.getByText(responses[1].label)).toBeInTheDocument();
        expect(screen.getByText(responses[2].label)).toBeInTheDocument();

        expect(screen.getByLabelText("hourcheckerclosed")).toBeInTheDocument();
        expect(screen.queryByLabelText("hourcheckeropen")).toBeNull();

        userEvent.click(screen.getByLabelText("hourcheckertoogle"));

        await waitFor(() =>
            expect(screen.queryByLabelText("hourcheckerclosed")).not.toBeInTheDocument(),
        );
        expect(await screen.findByLabelText("hourcheckeropen")).toBeInTheDocument();
    });

    it("updates correctly when selecting one value", async () => {
        const value = {
            "16h15": false,
            "16h30": false,
            "16h45": false,
            "17h00": false,
        };
        const handleChange = jest.fn();
        renderElement(value, handleChange);

        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(4);
        expect(screen.queryAllByLabelText("hourselected")).toHaveLength(0);

        userEvent.click(screen.getByLabelText("hourcheckertoogle"));
        userEvent.click(screen.getByText(responses[1].label));

        await waitFor(() =>
            expect(handleChange.mock.calls).toEqual([
                [{ name: responses[0].response.name }, false],
                [{ name: responses[1].response.name }, true],
                [{ name: responses[2].response.name }, false],
                [{ name: responses[3].response.name }, false],
            ]),
        );

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(3);
        expect(await screen.findAllByLabelText("hourselected")).toHaveLength(1);
    });

    it("updates correctly when deselecting one value ", async () => {
        const value = {
            "16h15": false,
            "16h30": true,
            "16h45": false,
            "17h00": false,
        };
        const handleChange = jest.fn();
        renderElement(value, handleChange);

        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(3);
        expect(screen.getAllByLabelText("hourselected")).toHaveLength(1);

        userEvent.click(screen.getByLabelText("hourcheckertoogle"));
        userEvent.click(screen.getByText(responses[1].label));

        await waitFor(() =>
            expect(handleChange.mock.calls).toEqual([
                [{ name: responses[0].response.name }, false],
                [{ name: responses[1].response.name }, false],
                [{ name: responses[2].response.name }, false],
                [{ name: responses[3].response.name }, false],
            ]),
        );

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(4);
        await waitFor(() => expect(screen.queryByLabelText("hourselected")).not.toBeInTheDocument());
    });

    it("updates correctly when selecting all values", async () => {
        const value = {
            "16h15": false,
            "16h30": false,
            "16h45": false,
            "17h00": false,
        };
        const handleChange = jest.fn();
        renderElement(value, handleChange);

        expect(screen.getAllByLabelText("hournotselected")).toHaveLength(4);
        expect(screen.queryAllByLabelText("hourselected")).toHaveLength(0);

        userEvent.click(screen.getByLabelText("hourcheckerclosed"));

        await waitFor(() =>
            expect(handleChange.mock.calls).toEqual([
                [{ name: responses[0].response.name }, true],
                [{ name: responses[1].response.name }, true],
                [{ name: responses[2].response.name }, true],
                [{ name: responses[3].response.name }, true],
            ]),
        );

        await waitFor(() => expect(screen.queryByLabelText("hournotselected")).not.toBeInTheDocument());
        expect(await screen.findAllByLabelText("hourselected")).toHaveLength(4);
    });

    it("updates correctly when deselecting all values", async () => {
        const value = {
            "16h15": true,
            "16h30": true,
            "16h45": true,
            "17h00": true,
        };
        const handleChange = jest.fn();
        renderElement(value, handleChange);

        expect(screen.queryAllByLabelText("hournotselected")).toHaveLength(0);
        expect(screen.getAllByLabelText("hourselected")).toHaveLength(4);

        userEvent.click(screen.getByLabelText("hourcheckerclosed"));

        await waitFor(() =>
            expect(handleChange.mock.calls).toEqual([
                [{ name: responses[0].response.name }, false],
                [{ name: responses[1].response.name }, false],
                [{ name: responses[2].response.name }, false],
                [{ name: responses[3].response.name }, false],
            ]),
        );

        expect(await screen.findAllByLabelText("hournotselected")).toHaveLength(4);
        await waitFor(() => expect(screen.queryByLabelText("hourselected")).not.toBeInTheDocument());
    });
});
