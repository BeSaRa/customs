import { LangKeysContract } from "@contracts/lang-keys-contract";

interface ITabData {
    name: string,
    langKey: keyof LangKeysContract,
    index: number,
    validStatus: () => boolean,
    show?: () => boolean
    checkTouchedDirty?: boolean,
    isTouchedOrDirty: () => boolean,
    getLangText?:(tab: ITabData, item?: any) => string
    [index: string]: any;
}
export type TabMap = { [key: string]: ITabData };