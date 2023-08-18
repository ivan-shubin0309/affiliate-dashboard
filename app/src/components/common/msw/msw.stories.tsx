import { Loading } from "@/components/common/Loading";
import { trpcMsw } from "@/server/api/mock";
import { MswTestingComponent } from "@/components/common/msw/msw-testing-component";

const meta = {
  component: Loading,
};

export default meta;

export const SampleQuery = {
  render: () => <MswTestingComponent />,
  parameters: {
    msw: {
      handlers: [
        trpcMsw.misc.sampleQuery.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data({ hello: "trololololololol" }));
        }),
      ],
    },
    nextjs: {
      router: {
        query: {
          user: "customer",
          debug: "otp",
          link: true,
        },
      },
    },
  },
};
