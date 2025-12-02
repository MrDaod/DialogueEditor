import { Node, Edge } from '@xyflow/react';

export type DialogueNodeData = {
  speaker: string;
  text: string;
  onChange?: (id: string, data: DialogueNodeData) => void;
};

export type DialogueNodeType = Node<DialogueNodeData, 'dialogue'>;

export type ChoiceOption = {
  id: string;
  text: string;
}

export type ChoiceNodeData = {
  options: ChoiceOption[];
  onChange?: (id: string, data: ChoiceNodeData) => void;
}

export type ChoiceNodeType = Node<ChoiceNodeData, 'choice'>;

export type FlowSheet = {
    id: string;
    name: string;
    nodes: (DialogueNodeType | ChoiceNodeType)[];
    edges: Edge[];
};

