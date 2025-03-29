import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Typography from '@tiptap/extension-typography';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Highlighter, 
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Type til editor-referansen
export interface RichTextEditorRef {
  getHTML: () => string;
  getText: () => string;
  setHTML: (html: string) => void;
  clearContent: () => void;
}

// Props til editoren
export interface RichTextEditorProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (content: { html: string; text: string }) => void;
  minHeight?: string;
  className?: string;
  error?: boolean;
  readOnly?: boolean;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ initialValue = '', placeholder = 'Skriv eller indsæt din tekst her...', onChange, minHeight = '200px', className, error, readOnly = false }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Define our editor
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder,
        }),
        Highlight,
        FontFamily,
        Typography,
      ],
      content: initialValue,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange({
            html: editor.getHTML(),
            text: editor.getText(),
          });
        }
      },
      editable: !readOnly,
    });

    // Eksponere metoder til parent-komponenten
    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || '',
      getText: () => editor?.getText() || '',
      setHTML: (html: string) => editor?.commands.setContent(html),
      clearContent: () => editor?.commands.clearContent(),
    }));

    // Sæt indhold når initialValue ændres (brug til form reset)
    useEffect(() => {
      if (editor && editor.getHTML() !== initialValue) {
        editor.commands.setContent(initialValue);
      }
    }, [editor, initialValue]);

    // Specialiseret paste handler til Google Docs og Microsoft Word formatering
    useEffect(() => {
      if (!editor) return;

      // Vi bruger en event listener med capture phase for at fange paste event før TipTap
      // det hjælper med at undgå dobbelt indsætning
      const handlePaste = (event: ClipboardEvent) => {
        // Kun håndter hvis vi har HTML i udklipsholderen
        if (event.clipboardData?.types.includes('text/html')) {
          // Tag HTML fra udklipsholderen
          let html = event.clipboardData.getData('text/html');
          
          // Tjek om det er fra Google Docs eller Microsoft Word
          const isGoogleDocs = html.includes('docs-internal-guid') || 
                             html.includes('google-docs') || 
                             html.includes('docs.google.com') ||
                             html.includes('id="docs-');
                             
          const isMicrosoftWord = html.includes('urn:schemas-microsoft-com:office:') ||
                                html.includes('mso-') ||
                                html.includes('w:WordDocument') ||
                                html.includes('<o:') ||
                                html.includes('office:word');
          
          // Hvis det hverken er fra Google Docs eller Word, lad browseren håndtere det normalt
          if (!isGoogleDocs && !isMicrosoftWord) {
            return;
          }
          
          // Ellers håndter det specialiseret for disse formater
          event.preventDefault(); // Forhindre standard indsætning
          event.stopPropagation(); // Forhindre at andre handlere kører
          
          // Opret et midlertidigt HTML-element med indholdet
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          
          // Generisk rensning funktion for formateret tekst
          const cleanupElements = (element: Element) => {
            // Bevar formatering men fjern applikation-specifikke attributter
            if (element.hasAttribute('style')) {
              const style = element.getAttribute('style') || '';
              // Behold kun specifik formatering vi ønsker at bevare
              const keepStyles = style.split(';')
                .filter(s => 
                  s.includes('font-weight') || 
                  s.includes('font-style') || 
                  s.includes('text-decoration') ||
                  s.includes('text-align') ||
                  s.includes('margin') ||
                  s.includes('padding')
                )
                .join(';');
                
              if (keepStyles) {
                element.setAttribute('style', keepStyles);
              } else {
                element.removeAttribute('style');
              }
            }
            
            // Fjern unødvendige attributter
            ['id', 'class', 'dir', 'data-id'].forEach(attr => {
              if (element.hasAttribute(attr)) {
                // Bevare nogle klasser der er semantiske
                if (attr === 'class') {
                  const className = element.getAttribute('class') || '';
                  if (className.includes('docs-') || 
                      className.includes('google-') || 
                      className.includes('mso-') ||
                      className.includes('Mso')) {
                    element.removeAttribute('class');
                  }
                } else {
                  element.removeAttribute(attr);
                }
              }
            });
            
            // Rekursivt behandl alle børneelementer
            Array.from(element.children).forEach(cleanupElements);
          };
          
          // Specifik håndtering for Google Docs
          if (isGoogleDocs) {
            // Fjern Google Docs-specifikke elementer
            const metaTags = tempDiv.querySelectorAll('meta');
            metaTags.forEach(meta => meta.remove());
            
            const styleElements = tempDiv.querySelectorAll('style');
            styleElements.forEach(style => style.remove());
            
            // Rens alle elementer
            cleanupElements(tempDiv);
          } 
          // Specifik håndtering for Microsoft Word
          else if (isMicrosoftWord) {
            // Fjern Word-specifikke elementer
            const xmlTags = tempDiv.querySelectorAll('xml');
            xmlTags.forEach(tag => tag.remove());
            
            const oTags = tempDiv.querySelectorAll('[o\\:*]');
            oTags.forEach(tag => tag.remove());
            
            const wTags = tempDiv.querySelectorAll('[w\\:*]');
            wTags.forEach(tag => tag.remove());
            
            // Rens alle elementer
            cleanupElements(tempDiv);
          }
          
          // Konverter spans med style attributter til semantiske elementer
          const spans = tempDiv.querySelectorAll('span');
          spans.forEach(span => {
            const style = span.getAttribute('style') || '';
            
            // Erstat med semantisk korrekte elementer
            if (style.includes('font-weight: bold') || 
                style.includes('font-weight: 700') || 
                style.includes('font-weight:bold') ||
                style.includes('font-weight:700')) {
              const strong = document.createElement('strong');
              strong.innerHTML = span.innerHTML;
              span.parentNode?.replaceChild(strong, span);
            } else if (style.includes('font-style: italic') || 
                      style.includes('font-style:italic')) {
              const em = document.createElement('em');
              em.innerHTML = span.innerHTML;
              span.parentNode?.replaceChild(em, span);
            } else if (style.includes('text-decoration: underline') || 
                      style.includes('text-decoration:underline')) {
              const u = document.createElement('u');
              u.innerHTML = span.innerHTML;
              span.parentNode?.replaceChild(u, span);
            }
          });
          
          // Få det rensede HTML
          html = tempDiv.innerHTML;
          
          // Indsæt det rensede indhold i editoren
          editor.commands.insertContent(html);
        }
      };

      // Tilføj event listener på editor's DOM-element med capture for at fange event før TipTap
      const editorElement = editor.view.dom;
      editorElement.addEventListener('paste', handlePaste, { capture: true });
      
      // Cleanup
      return () => {
        if (editorElement) {
          editorElement.removeEventListener('paste', handlePaste, { capture: true });
        }
      };
    }, [editor]);

    // Knapper til Bubble menu
    const ToolbarButton = ({ isActive, icon, onClick }: { isActive: boolean; icon: React.ReactNode; onClick: () => void }) => (
      <button
        className={cn(
          'p-1.5 rounded-md transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5 text-gray-700'
        )}
        onClick={onClick}
      >
        {icon}
      </button>
    );

    return (
      <div 
        className={cn(
          "relative rounded-lg border transition-colors cursor-text", 
          error ? "border-red-500" : isFocused ? "border-primary" : "border-gray-200",
          readOnly ? "border-transparent" : "",
          className
        )}
        onClick={() => {
          // Når der klikkes på en vilkårlig del af wrapper-div'en, så fokuser på editoren
          if (editor && !readOnly) {
            editor.commands.focus();
          }
        }}
      >
        {!readOnly && (
          <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none">
            <div className={cn(
              "bg-white/75 backdrop-blur-sm shadow-sm border border-gray-100 rounded-md py-1 px-2 transition-opacity",
              isFocused ? "opacity-100" : "opacity-0"
            )}>
              <div className="flex items-center text-xs text-gray-500">
                <span>Klik for at redigere eller vælg tekst for formatering</span>
              </div>
            </div>
          </div>
        )}
      
        {editor && !readOnly && editor.isEditable && (
          <BubbleMenu 
            editor={editor} 
            tippyOptions={{ 
              duration: 150,
              placement: 'top'
            }}
          >
            <div className="flex flex-wrap items-center bg-white border shadow-md rounded-md p-1">
              {/* Tekstformatering */}
              <div className="flex">
                <ToolbarButton
                  isActive={editor.isActive('bold')}
                  icon={<Bold className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('italic')}
                  icon={<Italic className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('underline')}
                  icon={<UnderlineIcon className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('highlight')}
                  icon={<Highlighter className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                />
              </div>
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              {/* Lister */}
              <div className="flex">
                <ToolbarButton
                  isActive={editor.isActive('bulletList')}
                  icon={<List className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('orderedList')}
                  icon={<ListOrdered className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
              </div>
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              {/* Justering */}
              <div className="flex">
                <ToolbarButton
                  isActive={editor.isActive({ textAlign: 'left' })}
                  icon={<AlignLeft className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                />
                <ToolbarButton
                  isActive={editor.isActive({ textAlign: 'center' })}
                  icon={<AlignCenter className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                />
                <ToolbarButton
                  isActive={editor.isActive({ textAlign: 'right' })}
                  icon={<AlignRight className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                />
              </div>
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              {/* Overskrifter */}
              <div className="flex">
                <ToolbarButton
                  isActive={editor.isActive('paragraph')}
                  icon={<Pilcrow className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().setParagraph().run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('heading', { level: 1 })}
                  icon={<Heading1 className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('heading', { level: 2 })}
                  icon={<Heading2 className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('heading', { level: 3 })}
                  icon={<Heading3 className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                />
                <ToolbarButton
                  isActive={editor.isActive('blockquote')}
                  icon={<Quote className="w-4 h-4" />}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
              </div>
              
              <div className="w-px h-5 bg-gray-200 mx-1"></div>
              
              {/* Typografi */}
              <div className="flex">
                <ToolbarButton
                  isActive={false} // Dette er altid aktivt når aktiveret
                  icon={<Type className="w-4 h-4" />}
                  onClick={() => {
                    // Anvend typografi-forbedringer (ligatures osv.)
                    // Dette er en one-way operation
                    editor.chain().focus().run();
                  }}
                />
              </div>
            </div>
          </BubbleMenu>
        )}
        
        <EditorContent 
          editor={editor} 
          className={cn(
            "prose prose-sm max-w-none w-full font-[inherit] bg-white p-3 rounded-lg",
            "focus-within:outline-none",
            "prose-headings:mt-4 prose-headings:mb-2 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-headings:font-bold prose-headings:text-gray-800",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:font-light",
            "prose-p:my-2 prose-p:font-normal"
          )}
          style={{ minHeight }}
        />
        
        {!isFocused && !readOnly && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"></div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';