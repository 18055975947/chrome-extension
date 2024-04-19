# 匹配模式（`Match patterns`）
## 一、匹配模式结构
匹配模式是采用以下结构的网址，用于指定一组网址：

```shell
<scheme>://<host>/<path>
```
### 1. **`scheme`**
必须是以下内容之一，并使用双斜线 (`//`) 与格式的其余部分分隔开：
- `http`
- `https`
- 通配符 `*`，仅与 `http` 或 `https` 匹配
- `file`

### 2. **`host`**
主机名 (`www.example.com`)。
- 主机名前的 `*`（用于匹配子网域 (`*.example.com`)），或仅使用通配符 `*`。 
- 如果在主机模式中使用通配符，它必须是第一个或唯一字符，并且后面必须跟一个句点 (`.`) 或正斜杠 (`/`)。

### 3. **`path`**

网址路径 (`/example`)。
- 对于主机权限，必须提供路径，但该路径会被忽略。按照惯例，应使用通配符 (`/*`)。

## 二、特殊匹配
### 1. `"<all_urls>"`

- 匹配以允许方案开头的所有网址，包括有效格式下列出的任何格式。由于会影响所有主机，因此在 Chrome 应用商店中审核使用它的插件可能需要更长时间。
### 2. `"file:///"`

- 允许插件在本地文件上运行。此模式要求用户手动授予访问权限。请注意，该情况需要三个斜杠，而不是两个。

### 3. 本地主机网址和 `IP` 地址

- 如需在开发期间匹配任何 `localhost` 端口，请使用 `http://localhost/*`。对于 `IP` 地址，请在路径中指定地址并添加通配符，例如 `http://127.0.0.1/*`。还可以使用 `http://*:*/*` 来匹配 `localhost、IP` 地址和任何端口。

### 4. 顶级网域匹配模式（`Top Level domain`）

- `Chrome` 不支持顶级域名 (`TLD`)的匹配格式。在各个 `TLD` 中指定匹配模式，例如 `http://google.es/*` 和 `http://google.fr/*`。

## 三、使用场景
插件可在多种使用场景中使用匹配模式，包括：

- 注入内容脚本
- 声明某些 `Chrome API` 除自身权限外还需要一些主机权限
- 授予对可通过 `Web` 访问的资源的访问权限。
- 允许使用 `"externally_connectable.matches"` 清单键收发消息。
## 四、示例
- `https://*/*` 或 `https://*/`
    - 匹配使用 `https` 架构的所有网址。
-   `https://*/foo*`
    - 匹配任意主机上使用 `https` 架构且路径以 `foo` 开头的任何网址。匹配示例包括 `https://example.com/foo/bar.html` 和 `https://www.google.com/foo`。
-   `https://*.google.com/foo*bar`
    - 匹配 `google.com` 主机上使用 `https` 架构且路径以 `foo` 开头、以 `bar` 结尾的任何网址。匹配示例包括 `https://www.google.com/foo/baz/bar` 和 `https://docs.google.com/foobar`。
-   `file:///foo*`
    - 匹配路径以 `foo` 开头的所有本地文件。匹配示例包括 `file:///foo/bar.html` 和 `file:///foo`。
-   `http://127.0.0.1/*` 或 `http://127.0.0.1/`
    - 匹配主机 127.0.0.1 上使用 `http` 架构的所有网址。匹配示例包括 `http://127.0.0.1/` 和 `http://127.0.0.1/foo/bar.html`。
-   `http://localhost/*`
    - 匹配任何 `localhost` 端口。
-   `*://mail.google.com/` 或 `*://mail.google.com/*`
    - 匹配以 `http://mail.google.com` 或 `https://mail.google.com` 开头的所有网址。

