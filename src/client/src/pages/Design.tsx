import { onCleanup } from "solid-js";
import { Button } from "../components/Button.tsx";
import { CheckboxField } from "../components/CheckboxField.tsx";
import { ButtonGroup } from "../components/ButtonGroup.tsx";
import { Icon } from "../components/Icon.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Layout } from "../components/Layout.tsx";
import { Toast, ToastContainer } from "../components/Toast.tsx";

export default function Design() {
  return (
    <Layout>
      <div className="px-10">
        <h1 className="my-8 text-xl border-b-2 pb-4">Buttons</h1>
        <h2 className="my-2">Primary Buttons:</h2>
        <div className="p-2 space-x-4">
          <Button size="xs">Button</Button>
          <Button size="sm">Button</Button>
          <Button size="md">Button</Button>
          <Button size="lg">Button</Button>
          <Button size="xl">Button</Button>
        </div>
        <h2 className="my-2">Secondary Buttons:</h2>
        <div className="p-2 space-x-4">
          <Button type="secondary" size="xs">Button</Button>
          <Button type="secondary" size="sm">Button</Button>
          <Button type="secondary" size="md">Button</Button>
          <Button type="secondary" size="lg">Button</Button>
          <Button type="secondary" size="xl">Button</Button>
        </div>
        <h2 className="mb-2">Dark Buttons:</h2>
        <div className="p-2 space-x-4 bg-gray-600">
          <Button type="dark" size="xs">Button</Button>
          <Button type="dark" size="sm">Button</Button>
          <Button type="dark" size="md">Button</Button>
          <Button type="dark" size="lg">Button</Button>
          <Button type="dark" size="xl">Button</Button>
        </div>
        <h2 className="my-2">Soft Buttons:</h2>
        <div className="p-2 space-x-4">
          <Button type="soft" size="xs">Button</Button>
          <Button type="soft" size="sm">Button</Button>
          <Button type="soft" size="md">Button</Button>
          <Button type="soft" size="lg">Button</Button>
          <Button type="soft" size="xl">Button</Button>
        </div>
        <h2 className="my-2">Icon Buttons:</h2>
        <div className="p-2 space-x-4">
          <Button icon rounded size="xs">
            <Icon name="close" />
          </Button>
          <Button icon rounded size="sm">
            <Icon name="close" />
          </Button>
          <Button icon rounded size="md">
            <Icon name="close" />
          </Button>
          <Button icon rounded size="lg">
            <Icon name="close" />
          </Button>
          <Button icon rounded size="xl">
            <Icon name="close" />
          </Button>
          <Button type="secondary" icon rounded size="xs">
            <Icon name="close" />
          </Button>
          <Button type="secondary" icon rounded size="sm">
            <Icon name="close" />
          </Button>
          <Button type="secondary" icon rounded size="md">
            <Icon name="close" />
          </Button>
          <Button type="secondary" icon rounded size="lg">
            <Icon name="close" />
          </Button>
          <Button type="secondary" icon rounded size="xl">
            <Icon name="close" />
          </Button>
          <Button type="soft" icon rounded size="xs">
            <Icon name="close" />
          </Button>
          <Button type="soft" icon rounded size="sm">
            <Icon name="close" />
          </Button>
          <Button type="soft" icon rounded size="md">
            <Icon name="close" />
          </Button>
          <Button type="soft" icon rounded size="lg">
            <Icon name="close" />
          </Button>
          <Button type="soft" icon rounded size="xl">
            <Icon name="close" />
          </Button>
        </div>
        <h1 className="my-8 text-xl border-b-2 pb-4">Form</h1>
        <h2 className="my-2">Checkbox</h2>
        <div className="p-2 space-x-4">
          <CheckboxField name="use-tabs" label="Use tabs" selected={true} />
          <CheckboxField name="use-semi" label="Use semi" />
          <CheckboxField name="single-quote" label="Single quote" />
        </div>
        <h2 className="my-2">ButtonGroup</h2>
        <div className="p-2 space-x-4">
          <ButtonGroup
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSX", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            size="xs"
            onChange={(item) => console.log(item)}
          />
          <ButtonGroup
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSX", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            size="sm"
            onChange={(itemValue) => console.log(itemValue)}
          />
          <ButtonGroup
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSX", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            size="md"
            onChange={(itemValue) => console.log(itemValue)}
          />
          <ButtonGroup
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSX", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            size="lg"
            onChange={(itemValue) => console.log(itemValue)}
          />
          <ButtonGroup
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSX", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            size="xl"
            onChange={(itemValue) => console.log(itemValue)}
          />
        </div>
        <h2 className="my-2">Textarea</h2>
        <div className="p-2 space-y-4">
          <Textarea size="xs" placeholder="input..." />
          <Textarea size="sm" placeholder="input..." />
          <Textarea size="md" placeholder="input..." />
          <Textarea size="lg" placeholder="input..." />
          <Textarea size="xl" placeholder="input..." />
        </div>
        <h1 className="my-8 text-xl border-b-2 pb-4">Notify</h1>
        <div className="p-2 space-x-4">
          <Toast
            timeout={0}
            type="success"
            title="Success"
            content="Query data successfully."
          />
          <Toast
            timeout={0}
            type="warning"
            title="Warning"
            content="Query data unsuccessfully."
          />
          <Toast
            timeout={0}
            type="info"
            title="Info"
            content="Query data processing."
          />
          <Toast
            timeout={0}
            type="error"
            title="Error"
            content="Query data failed."
          />
        </div>
      </div>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20"
      >
        <div
          className="flex w-full flex-col items-center space-y-4 sm:items-end z-20"
          id="notify-container"
        >
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}
