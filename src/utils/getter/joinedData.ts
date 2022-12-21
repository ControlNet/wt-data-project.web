import { Getter } from "./getter";
import type { JoinedRow } from "@/types/dataTypes";
import type { Mode } from "@/types/options";

export class JoinedRowGetter extends Getter {
    protected readonly data: JoinedRow;
    protected readonly mode: Mode;

    constructor(data: JoinedRow, mode: Mode) {
        super();
        this.data = data;
        this.mode = mode;
    }

    get br(): number {
        switch (this.mode) {
            case "ab":
                return +this.data.ab_br;
            case "rb":
                return +this.data.rb_br;
            case "sb":
                return +this.data.sb_br;
        }
    }

    get battles(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_battles"];
            case "rb":
                return +this.data["rb_battles"];
            case "sb":
                return +this.data["sb_battles"];
        }
    }

    get winRate(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_win_rate"];
            case "rb":
                return +this.data["rb_win_rate"];
            case "sb":
                return +this.data["sb_win_rate"];
        }
    }

    get airFragsPerBattle(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_air_frags_per_battle"];
            case "rb":
                return +this.data["rb_air_frags_per_battle"];
            case "sb":
                return +this.data["sb_air_frags_per_battle"];
        }
    }

    get airFragsPerDeath(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_air_frags_per_death"];
            case "rb":
                return +this.data["rb_air_frags_per_death"];
            case "sb":
                return +this.data["sb_air_frags_per_death"];
        }
    }

    get groundFragsPerBattle(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_ground_frags_per_battle"];
            case "rb":
                return +this.data["rb_ground_frags_per_battle"];
            case "sb":
                return +this.data["sb_ground_frags_per_battle"];
        }
    }

    get groundFragsPerDeath(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_ground_frags_per_death"]
            case "rb":
                return +this.data["rb_ground_frags_per_death"]
            case "sb":
                return +this.data["sb_ground_frags_per_death"]
        }
    }

    get rpRate(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_rp_rate"];
            case "rb":
                return +this.data["rb_rp_rate"];
            case "sb":
                return +this.data["sb_rp_rate"];
        }
    }

    get slRate(): number {
        switch (this.mode) {
            case "ab":
                return +this.data["ab_sl_rate"];
            case "rb":
                return +this.data["rb_sl_rate"];
            case "sb":
                return +this.data["sb_sl_rate"];
        }
    }
}