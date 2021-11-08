import classNames from 'classnames'
import { useState, forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

import InfoNotification from '../../../ui/InfoNotification'
import { Button } from 'react-bulma-components'


function SortableItem({ id, option, disabled }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <Item
      ref={setNodeRef}
      option={option}
      style={style}
      ghost={isDragging}
      listeners={listeners}
      disabled={disabled}
      {...attributes}
      >
    </Item>
  )
}

const Item = forwardRef((
  {
    option,
    ghost,
    dragOverlay,
    listeners,
    disabled,
    ...props
  }, ref) => {
    useEffect(() => {
      if (!dragOverlay) return;
      document.body.style.cursor = 'grabbing';
      return () => {
        document.body.style.cursor = '';
      }
    }, [dragOverlay])

    const classes = classNames(
      'respond-option-rc',
      ghost && 'ghost',
      dragOverlay && 'drag-overlay'
    )
    return (
      <li
        className={classes}
        ref={ref}
        >
        <div
          className={dragOverlay ? 'box drag-overlay' : 'box'}
          {...props}
          >
          <p>{option.name}</p>
          
          <div className='handle' {...listeners} >
            <FontAwesomeIcon icon='grip-vertical' />
          </div>
        </div>
      </li>
    )
  }
)

export default function RankedChoiceRespond(props) {

  const options = new Map(props.poll.options.map((option) => [option._id, option]));
  const response = Array.from(props.responses.values())[0];
  
  let initialOrder;
  if (response) {
    initialOrder = response.order;
  } else {
    const optionArray = Array.from(options.keys());
    initialOrder = props.poll.randomiseOrder ? shuffle(optionArray) : optionArray;
  }

  const [loading, setLoading] = useState(false);

  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(initialOrder);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  return <div>
    <InfoNotification>Drag and drop to rearrange the options</InfoNotification>
    
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, restrictToParentElement]}
      >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
        >
        <ul className={classNames('respond-options-rc', response && 'disabled')}>
          {items.map(id => <SortableItem key={id} id={id} option={options.get(id)} />)}
        </ul>
      </SortableContext>
      {createPortal(
        <DragOverlay>
        {activeId ? <Item option={options.get(activeId)} dragOverlay /> : null}
        </DragOverlay>
      , document.body)}
    </DndContext>

    <Button
      color={response ? 'warning' : 'info'}
      style={{marginTop: '1.5rem'}}
      onClick={response ? handleRetract : handleSubmit}
      loading={loading}
      disabled={props.poll.locked}
      fullwidth
      >{response ? 'Retract' : 'Submit'} Response</Button>
  </div>

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      })
    }
    setActiveId(null);
  }

  async function handleSubmit() {
    setLoading(true);
    await props.submitResponse({ order: items });
    setLoading(false);
  }

  async function handleRetract() {
    setLoading(true);
    await props.deleteResponse(response._id);
    setLoading(false);
  }

}

/**
 * Shuffles array in place. ES6 version
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
 */
 function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
