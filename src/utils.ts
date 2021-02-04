export namespace utils {
    export function getSelectedValue(id: string) {
        return (<HTMLSelectElement>document.getElementById(id)).value;
    }

    export const setEvent = {
        byIds(...elementIds: Array<string>) {
            const elements = elementIds.map(document.getElementById);
            return {
                onchange: (event: () => void) => {
                    return elements.forEach(element => element.onchange = event)
                }
            }
        },

        byClass(className: string) {
            const elements = <Array<HTMLElement>>Array.from(document.getElementsByClassName(className));
            return {
                onchange: (event: () => void) => {
                    return elements.forEach(element => element.onchange = event)
                }
            }
        }
    }

    export const nations = ["USA", "Germany", "USSR", "Britain", "Japan", "France", "Italy", "China", "Sweden"];
    export const brs = ['1.0 ~ 2.0', '1.3 ~ 2.3', '1.7 ~ 2.7', '2.0 ~ 3.0', '2.3 ~ 3.3', '2.7 ~ 3.7',
        '3.0 ~ 4.0', '3.3 ~ 4.3', '3.7 ~ 4.7', '4.0 ~ 5.0', '4.3 ~ 5.3', '4.7 ~ 5.7',
        '5.0 ~ 6.0', '5.3 ~ 6.3', '5.7 ~ 6.7', '6.0 ~ 7.0', '6.3 ~ 7.3', '6.7 ~ 7.7',
        '7.0 ~ 8.0', '7.3 ~ 8.3', '7.7 ~ 8.7', '8.0 ~ 9.0', '8.3 ~ 9.3', '8.7 ~ 9.7',
        '9.0 ~ 10.0', '9.3 ~ 10.3', '9.7 ~ 10.7', '10.0 ~ 11.0', '10.3 ~ 11.3', '10.7 ~ 11.7'
    ];

    export function isNotNull(x: any) {
        return x !== null && x !== undefined;
    }
}

export enum COLORS {
    GREEN= "#C3E88D",
    YELLOW = "#FFCB6B",
    RED = "#F07178",
    BLUE = "#82AAFF",
    PURPLE = "#C792EA",
    ORANGE = "#F78C6C",
    AZURE = "#467CDA",
    SKY = "#89DDFF",
    BLACK = "#2B2B2B",
    GRAY = "#616161",
    WHITE = "#EEFFFF"
}

