import { JSX } from "react";

import Content from "@/app/Content";
import Page from "@/components/Page";

export default async function Home(): Promise<JSX.Element> {
    return (
        <Page>
            <Content />
        </Page>
    );
}
