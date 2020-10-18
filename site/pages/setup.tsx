import React, { useMemo, useState } from 'react';
import {
  Form,
  Card,
  Col,
  Row,
  Alert,
  Spinner,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap';
import classnames from 'classnames';
import HelpCircleIcon from 'mdi-react/HelpCircleIcon';
import JSZip from 'jszip';

const FILES = Symbol('files');

const readFile = (file: File) => {
  return new Promise<ArrayBuffer>((_resolve, _reject) => {
    let resolved = false;
    const resolve = (value: ArrayBuffer) => {
      if (resolved) return;
      resolved = true;
      _resolve(value);
    };
    const reject = (err: Error) => {
      if (resolved) return;
      resolved = true;
      _reject(err);
    };
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener('error', () => {
      reject(reader.error || new Error(`Error reading file ${file.name}`));
    });
    reader.addEventListener('abort', () =>
      reject(new Error(`Reading of file ${file.name} was aborted`)),
    );
    reader.addEventListener('load', () => {
      resolve(reader.result as ArrayBuffer);
    });
  });
};

type Dir = {
  [FILES]: string[];
  [key: string]: Dir;
};

const files = [
  'dom5key',
  'dom5.sh',
  'dom5_amd64',
  'dom5_mac',
  'dom5_x86',
  'Dominions5.exe',
];

const folders = ['data', 'maps'];

function findGameRoot(foundFiles: [string, string[]][]): string[] | void {
  if (foundFiles.length === 0) return undefined;
  // eslint-disable-next-line no-param-reassign
  foundFiles = [...foundFiles].sort(
    ([nameA, pathA], [nameB, pathB]) =>
      files.indexOf(nameA) - files.indexOf(nameB) ||
      pathA.length - pathB.length,
  );
  return foundFiles[0][1];
}

type ZipStatus = {
  files: {
    [key in typeof files[number]]: boolean;
  };
  folders: {
    [key in typeof folders[number]]: boolean;
  };
  passed: boolean;
  rootStr: string;
};

const COMPLETE_FAILURE = (() => {
  const fileObj: {
    [key in typeof files[number]]: boolean;
  } = {};
  const folderObj: {
    [key in typeof files[number]]: boolean;
  } = {};
  files.forEach((file) => {
    fileObj[file] = false;
  });
  folders.forEach((folder) => {
    folderObj[folder] = false;
  });
  return {
    files: fileObj,
    folders: folderObj,
    passed: false,
    rootStr: '/',
  };
})();

function checkFiles(root: Dir, gameRoot: string[]): ZipStatus {
  const gameRootDir = gameRoot.reduce((curDir, p) => curDir[p], root);
  const fileObj: {
    [key in typeof files[number]]: boolean;
  } = {};
  const folderObj: {
    [key in typeof files[number]]: boolean;
  } = {};
  let passed = true;
  files.forEach((file) => {
    fileObj[file] = gameRootDir[FILES].includes(file);
    passed = passed && fileObj[file];
  });
  folders.forEach((folder) => {
    folderObj[folder] = Object.prototype.hasOwnProperty.call(
      gameRootDir,
      folder,
    );
    passed = passed && folderObj[folder];
  });
  return {
    files: fileObj,
    folders: folderObj,
    passed,
    rootStr: `/${[...gameRoot, ''].join('/')}`,
  };
}

const GenericErrorInfo = (
  props: Omit<React.ComponentProps<typeof Popover>, 'id'>,
) => (
  <Popover {...props} id="upnp-popover">
    <Popover.Title as="h3">What went wrong?</Popover.Title>
    <Popover.Content>
      Something went wrong with the preliminary loading and/or parsing, this is
      not 100% accurate though. Double check it&apos;s the correct file. If
      you&apos;re certain you&apos;ve followed the instructions you may
      disregard from this message and continue.
    </Popover.Content>
  </Popover>
);

const MissingFilesErrorInfo = (
  props: Omit<React.ComponentProps<typeof Popover>, 'id'>,
) => (
  <Popover {...props} id="upnp-popover">
    <Popover.Title as="h3">We can&apos;t find important files!</Popover.Title>
    <Popover.Content>
      <p>
        We were able to load and successfully parse filenames of the zip-file.
        But we did not find crucial files that we use for sanity checking. This
        is not an exhaustive list of all required files. Please zip the entire
        folder and not just this list.
      </p>
      <p>
        If you&apos;re certain this is a mistake, you can still attempt to
        upload it to the server, but considering we were able to read the file
        directory, the server is probably gonna come to the same result.
      </p>
    </Popover.Content>
  </Popover>
);

function Dom5ZipFile(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [zipStatus, setZipStatus] = useState<
    (ZipStatus & { zipName: string }) | null
  >(null);
  const readZip = useMemo(() => {
    return async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      setZipStatus(null);
      if (file == null) return;
      setError(null);
      try {
        setIsLoading(true);
        const root: Dir = Object.create(null);
        root[FILES] = [];
        const filesOfInterest: [string, string[]][] = [];
        Object.entries(
          (
            await JSZip.loadAsync(await readFile(file)).catch((err) => {
              // eslint-disable-next-line no-console
              console.error(err);
              return Promise.reject(
                new Error(
                  "Failure to parse zip file. Are you sure it's a proper zip?",
                ),
              );
            })
          ).files,
        ).forEach(([pathString, obj]) => {
          const path = pathString.split('/').filter((str) => str !== '');
          if (obj.dir) {
            path.reduce((curDir, pathName) => {
              if (!Object.prototype.hasOwnProperty.call(curDir, pathName)) {
                // eslint-disable-next-line no-param-reassign
                curDir[pathName] = Object.create(null);
                // eslint-disable-next-line no-param-reassign
                curDir[pathName][FILES] = [];
              }
              return curDir[pathName];
            }, root);
            return;
          }
          const filename = path.pop();
          if (filename == null) return;
          const dir: Dir = path.reduce((curDir, pathName) => {
            if (!Object.prototype.hasOwnProperty.call(curDir, pathName)) {
              // eslint-disable-next-line no-param-reassign
              curDir[pathName] = Object.create(null);
              // eslint-disable-next-line no-param-reassign
              curDir[pathName][FILES] = [];
            }
            return curDir[pathName];
          }, root);
          if (files.includes(filename)) filesOfInterest.push([filename, path]);
          dir[FILES].push(filename);
        });
        const gameRoot = findGameRoot(filesOfInterest);
        if (gameRoot === undefined) {
          setZipStatus({
            ...COMPLETE_FAILURE,
            zipName: file.name,
          });
        } else {
          setZipStatus({ ...checkFiles(root, gameRoot), zipName: file.name });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  }, []);
  const [fileStatuses, folderStatuses] = useMemo(() => {
    if (zipStatus == null) return [null, null];
    return [Object.entries(zipStatus.files), Object.entries(zipStatus.folders)];
  }, [zipStatus]);
  const FileListWrapper = useMemo(() => {
    return zipStatus?.passed
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((({ children }: any) => children) as typeof OverlayTrigger)
      : OverlayTrigger;
  }, [zipStatus?.passed]);
  return (
    <div>
      <Form.Control
        type="file"
        accept="application/zip,application/x-zip-compressed"
        onChange={readZip}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="d-flex align-items-center mt-3">
          <Spinner animation="border" className="mr-2" variant="primary" />
          <strong>Analyzing zipfile...</strong>
        </div>
      )}
      {error != null && (
        <OverlayTrigger
          placement="auto"
          delay={{ show: 250, hide: 400 }}
          overlay={GenericErrorInfo}
        >
          <Alert variant="danger" className="mt-3 pr-5">
            <HelpCircleIcon
              className="position-absolute"
              style={{ top: 12, right: 12 }}
            />
            <strong className="d-inline-flex align-items-baseline">
              <span>{error.name}:</span>
            </strong>{' '}
            {error.message}
          </Alert>
        </OverlayTrigger>
      )}
      {zipStatus != null && (
        <FileListWrapper
          placement="auto"
          delay={{ show: 250, hide: 400 }}
          overlay={MissingFilesErrorInfo}
        >
          <Alert
            variant={zipStatus.passed ? 'success' : 'danger'}
            className={classnames('mt-3', !zipStatus.passed && 'pr-5')}
          >
            {!zipStatus.passed && (
              <HelpCircleIcon
                className="position-absolute"
                style={{ top: 12, right: 12 }}
              />
            )}
            {zipStatus.passed ? (
              <strong>This file looks valid!</strong>
            ) : (
              <strong className="d-inline-flex align-items-baseline">
                <span>
                  We had trouble finding one or more important files in this
                  zip. Please make sure you zip the correct folder!
                </span>
              </strong>
            )}
            <br />
            {zipStatus.zipName}
            {zipStatus.rootStr}
            <ul className="zipfile-status-report">
              {fileStatuses?.map(([file, found]) => (
                <li key={file} className={found ? 'success' : undefined}>
                  {file}
                </li>
              ))}
              {folderStatuses?.map(([folder, found]) => (
                <li key={folder} className={found ? 'success' : undefined}>
                  {folder}/
                </li>
              ))}
            </ul>
          </Alert>
        </FileListWrapper>
      )}
    </div>
  );
}

export default function Index(): JSX.Element {
  return (
    <Form>
      <h1 className="mb-5">Server manager setup</h1>
      <Card className="my-2">
        <Card.Header>
          <Card.Title>Dominions 5 files</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row className="flex-wrap-reverse">
            <Col className="col" lg={6} xs={12}>
              <hr className="d-lg-none" />
              <Dom5ZipFile />
            </Col>
            <Col className="col position-relative" lg={6} xs={12}>
              <div
                style={{ left: 0 }}
                className="d-none h-100 border-left d-lg-block position-absolute"
              />
              <p>
                Please provide a zip-file with all the Dominions 5 binaries and
                data. On windows, with steam install, this is usually located in
                the{' '}
                <code>
                  C:\Program Files (x86)\Steam\steamapps\common\Dominions5
                </code>{' '}
                directory. Please locate this folder, create a zip of it and
                upload it here.
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Form>
  );
}
