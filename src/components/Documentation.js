import React, { useState, useEffect } from 'react';
import '../styling/docs.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Documentation = ({ docInput = require('./docs.json') }) => {
  const [expandedCogs, updateExpandedCogs] = useState(null);
  const [expandedExamples, updateExpandedExamples] = useState(null);

  useEffect(() => {
    if (docInput && expandedCogs === null) {
      var cogs = {};
      docInput.forEach((cog) => {
        cogs = {
          ...cogs,
          [`${cog.name.replace(/ /g, '_')}_expanded`]: false,
        };
      });
      updateExpandedCogs(cogs);
    }

    if (docInput && expandedExamples === null) {
      var examples = {};
      docInput.forEach((cog) => {
        cog.commands.forEach((command) => {
          console.log(command)
          examples = {
            ...examples,
            [`${command.command.replace(/ /g, '_')}_example_expanded`]: true,
          };
        })
      });

      updateExpandedExamples(examples);
    }
  }, [docInput, expandedCogs, expandedExamples]);

  const getParameters = (command) => {
    var parameters = [];
    command.parameters.forEach((parameter) => {
      parameters.push(<React.Fragment key={parameter}>[{parameter}]</React.Fragment>);
    });
    return parameters;
  };

  const getCommands = (cog) => {
    var commands = [];
    cog.commands.forEach((command) => {
      const parameters = getParameters(command);
      const id = `${command.command.replace(/ /g, '_')}_example_expanded`;

      commands.push(
        <li key={command.command + parameters}>
          <code data-testid="documentation-cog-command">
            {command.command} {parameters}
          </code>
          <div data-testid="documentation-cog-description">{command.description}</div>
          <div key={id} data-testid="expandable-example">
            <div data-testid="documentation-cog-example" onClick={() => expandExample(id)}>
              <FontAwesomeIcon className="documentation__caret" icon={expandedExamples[id] ? faCaretRight : faCaretDown} />
              Open example
            </div>
            <ul className={expandedExamples[id] ? 'documentation__hidden' : ''} data-testid="example-commands">
            {command.example}
            </ul>
          </div>
        </li>
      );
    });
    return commands;
  };

  const expandCog = (id) => {
    const cogs = JSON.parse(JSON.stringify(expandedCogs));
    cogs[id] = !cogs[id];
    updateExpandedCogs(cogs);
  };

  const expandExample = (id) => {
    const examples = JSON.parse(JSON.stringify(expandedExamples));
    examples[id] = !examples[id];
    updateExpandedExamples(examples);
  };

  const buildDocumentation = (documentationJson) => {
    var docs = [];
    documentationJson.forEach((cog) => {
      const commands = getCommands(cog);
      const id = `${cog.name.replace(/ /g, '_')}_expanded`;
      docs.push(
        <div key={id} data-testid="expandable-doc">
          <div className="documentation__expandable" onClick={() => expandCog(id)} data-testid="expand-clickable">
            <FontAwesomeIcon className="documentation__caret" icon={expandedCogs[id] ? faCaretRight : faCaretDown} />
            <h2 className="documentation__cogname" data-testid="documentation-cog-name">
              {cog.name}
            </h2>
            <div className="documentation__divider" />
          </div>
          <ul className={expandedCogs[id] ? 'documentation__hidden' : ''} data-testid="cog-commands">
            {commands}
          </ul>
        </div>
      );
    });

    return docs;
  };

  return (
    <main className="content">
      <div data-testid="documentation" className="documentation">
        {expandedCogs && docInput ? (
          <>
            <h1 className="documentation__title" data-testid="documentation-title">
              LIST OF COGS
            </h1>
            {buildDocumentation(docInput)}
          </>
        ) : (
          <div className="documentation__title" data-testid="documentation-error">
            Documentation can not be found
          </div>
        )}
      </div>
    </main>
  );
};

export default Documentation;
